import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Audio } from "expo-av";

const useAudio = () => {
    const sound = useRef<Audio.Sound | null>(null);
    const cacheAudio = useRef<{ [key: string]: Audio.Sound }>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [playedSongs, setPlayedSongs] = useState<Song[]>([]);

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

    const loadSound = useCallback(async (newSong: Song) => {
        setCurrentSong(newSong);
        if (sound.current) {
            await sound.current.unloadAsync();
        }
        if (cacheAudio.current[newSong.file_path]) {
            sound.current = cacheAudio.current[newSong.file_path];
        } else {
            sound.current = new Audio.Sound();
            cacheAudio.current[newSong.file_path] = sound.current;
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
            await sound.current.setPositionAsync(position);
        }
    }, []);

    const play = useCallback(async (newSong: Song) => {
        await loadSound(newSong)
        await sound.current?.playAsync()
        setIsPlaying(true)

        setPlayedSongs(prev => {
            const updatedList = [...prev];
            const songIndex = updatedList.findIndex(song => song.file_path === newSong.file_path);

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
        if (currentSongIndex !== null && currentSongIndex < playedSongs.length - 1) {
            const nextSong = playedSongs[currentSongIndex + 1];
            await play(nextSong);
        }
    }, [currentSongIndex, playedSongs, play]);

    const playPrevious = useCallback(async () => {
        if (currentSongIndex !== null && currentSongIndex > 0) {
            const previousSong = playedSongs[currentSongIndex - 1];
            await play(previousSong);
        }
    }, [currentSongIndex, playedSongs, play]);

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

    const toggleRepeat = useCallback(async (isRepeating: boolean) => {
        if (isRepeating) {
            await sound.current?.setIsLoopingAsync(true);
        } else {
            await sound.current?.setIsLoopingAsync(false);
        }
    }, [getCurrentPosition]);

    return useMemo(() => ({
        currentSong,
        toggleRepeat,
        play,
        playNext,
        playPrevious,
        pause,
        resume,
        isPlaying,
        getCurrentPosition,
        setPosition
    }), [currentSong, isPlaying, playNext, playPrevious, play, pause, resume, getCurrentPosition, setPosition]);
};

export default useAudio;
