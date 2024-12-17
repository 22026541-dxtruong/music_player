import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Audio, AVPlaybackStatus} from "expo-av";
import {shuffleSongList} from "@/utils/suffleSongList";

const useAudio = () => {
    const sound = useRef<Audio.Sound | null>(null);
    // Danh sách bài hát trong album
    const [songList, setSongList] = useState<Song[]>([]);
    const [songListIndex, setSongListIndex] = useState<number>()
    const [prevSongList, setPrevSongList] = useState<Song[]>([])

    const cacheAudio = useRef<{ [key: number]: Audio.Sound }>({});
    const [loading, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    // Danh sách bài hát đã phát
    const [playedSongs, setPlayedSongs] = useState<Song[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [autoNext, setIsAutoNext] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    useEffect(() => {
        const setAudioMode = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: true
            });
        };

        setAudioMode().catch(console.error);

        return () => {
            if (sound.current) {
                sound.current.unloadAsync().catch(console.error);
            }
        };
    }, []);

    useEffect(() => {
        if (autoNext && currentSong && songList.map(item => item.song_id).includes(currentSong.song_id)) {
            setSongListIndex(songList.findIndex(item => item.song_id === currentSong.song_id))
        }
    }, [songList, currentSong, autoNext]);

    const loadSound = useCallback(async (newSong: Song) => {
        setCurrentSong(newSong);
        if (sound.current) {
            await sound.current.unloadAsync();
        }
        if (cacheAudio.current[newSong.song_id]) {
            sound.current = cacheAudio.current[newSong.song_id];
        } else {
            sound.current = new Audio.Sound();
            cacheAudio.current[newSong.song_id] = sound.current;
        }
        await sound.current.loadAsync({ uri: newSong.file_path });
        const status = await sound.current.getStatusAsync();
        newSong.duration = status.isLoaded ? status.durationMillis : 0;
    }, []);

    const getCurrentPosition = useCallback(async () => {
        if (sound.current) {
            const status = await sound.current.getStatusAsync();
            return (status.isLoaded) ? status.positionMillis : 0;
        }
        return 0;
    }, []);

    const setPosition = useCallback(async (position: number) => {
        if (sound.current) {
            setIsPlaying(true)
            await sound.current.setPositionAsync(position);
        }
    }, []);

    const play = useCallback(async (newSong: Song) => {
        setLoading(true)
        await loadSound(newSong)
        await sound.current?.playAsync()
        setLoading(false)
        setIsPlaying(true)

        setPlayedSongs(prev => {
            const updatedList = [...prev];
            const songIndex = updatedList.findIndex(song => song.song_id === newSong.song_id);

            if (songIndex === -1) {
                updatedList.push(newSong);
                setCurrentSongIndex(updatedList.length - 1);
            } else {
                setCurrentSongIndex(songIndex);
            }

            return updatedList;
        });
    }, [loadSound]);

    const playNext = useCallback(async () => {
        if (autoNext && songListIndex !== undefined && songListIndex < songList.length - 1) {
            await play(songList[songListIndex + 1]);
            setSongListIndex(songListIndex + 1)
            return
        }
        if (currentSongIndex !== null && currentSongIndex < playedSongs.length - 1) {
            const nextSong = playedSongs[currentSongIndex + 1];
            await play(nextSong);
        }
    }, [currentSongIndex, playedSongs, play, songList, songListIndex, autoNext]);

    const playPrevious = useCallback(async () => {
        if (autoNext && songListIndex !== undefined && songListIndex > 0) {
            await play(songList[songListIndex - 1]);
            setSongListIndex(songListIndex - 1)
            return
        }
        if (currentSongIndex !== null && currentSongIndex > 0) {
            const previousSong = playedSongs[currentSongIndex - 1];
            await play(previousSong);
        }
    }, [currentSongIndex, playedSongs, play, songList, songListIndex, autoNext]);

    const pause = useCallback(async () => {
        if (sound.current) {
            await sound.current.pauseAsync();
            setIsPlaying(false);
        }
    }, []);

    const resume = useCallback(async () => {
        if (sound.current) {
            await sound.current.playAsync();
            setIsPlaying(true);
        }
    }, [])

    const toggleRepeat = useCallback(async () => {
        setIsRepeating(prev => !prev);
    }, []);

    useEffect(() => {
        const repeat = async () => {
            await sound.current?.setIsLoopingAsync(isRepeating);
        }
        repeat().catch(console.error);
    }, [isRepeating]);

    const handlePlaySongList = useCallback(async (data?: Song[]) => {
        if (!autoNext && data) {
            setIsShuffle(false)
            setSongList(data)
            setSongListIndex(0)
            if (currentSong && currentSong.song_id === data[0].song_id) {
                if (!isPlaying) {
                    await resume();
                }
            } else {
                await play(data[0]);
            }
        } else {
            setSongList([])
            setSongListIndex(undefined)
        }
        setIsAutoNext(prev => !prev)
    }, [autoNext, currentSong, isPlaying, play, resume])

    const handleShuffle = useCallback(() => {
        if (isShuffle) {
            setSongList(prevSongList);
        } else {
            setPrevSongList(songList);
            setSongList(prev => shuffleSongList(prev, songListIndex || 0));
            console.log('shuffle')
        }
        setIsShuffle(prev => !prev);
    }, [isShuffle, prevSongList, songList, songListIndex]);

    useEffect(() => {
        if (sound.current) {
            const statusUpdate = async (status: AVPlaybackStatus) => {
                if (!status.isLoaded) return;

                // Check if the song has finished playing
                // @ts-ignore
                if (status.positionMillis >= currentSong?.duration) { // 1 second before finishing
                    setIsPlaying(isRepeating);
                    if (autoNext && !isRepeating) {
                        await playNext();
                    }
                }
            }

            sound.current.setOnPlaybackStatusUpdate(statusUpdate);
        }

        return () => {
            if (sound.current) {
                sound.current.setOnPlaybackStatusUpdate(null);
            }
        };
    }, [autoNext, playNext, currentSong, isRepeating]);

    return useMemo(() => ({
        currentSong,
        loading,
        toggleRepeat,
        play,
        playNext,
        playPrevious,
        pause,
        resume,
        isPlaying,
        getCurrentPosition,
        setPosition,
        autoNext,
        handlePlaySongList,
        songList,
        isShuffle,
        handleShuffle,
        songListIndex,
        isRepeating
    }), [isRepeating, songListIndex, isShuffle, handleShuffle, songList, autoNext, handlePlaySongList ,currentSong, isPlaying, playNext, playPrevious, play, pause, resume, getCurrentPosition, setPosition, loading]);
};

export default useAudio;
