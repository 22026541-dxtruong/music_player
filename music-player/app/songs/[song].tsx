import React, {useEffect, useState} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {router} from "expo-router";
import {useAudioContext} from "@/context/AudioContext";
import {Image} from "expo-image";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import {formatTime} from "@/utils/formatTime";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";
import FloatingDownload from "@/components/FloatingDownload";
import {useDownloadContext} from "@/context/DownloadContext";
import {useSQLiteContext} from "expo-sqlite";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useAuthContext} from "@/context/AuthContext";
import SongOptions from "@/components/SongOptions";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";

const SongScreen = () => {
    const { user } = useAuthContext()
    const audioContext = useAudioContext()
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${audioContext.currentSong?.artist_id}`)
    const { data: favoriteSong } = useFetch<FavoriteSong[]>(BASE_URL + `favorites/songs?user_id=${user?.user_id}`)
    const { postData: addSong } = useFetch(BASE_URL + `favorites/songs/add`)
    const { deleteData: deleteSong } = useFetch(BASE_URL + `favorites/songs/delete?user_id=${user?.user_id}&song_id=${audioContext.currentSong?.song_id}`)
    const inset = useSafeAreaInsets()
    const [sliderValue, setSliderValue] = useState(0);
    const [isRepeating, setIsRepeating] = useState(false);
    const [showSongOptions, setSongOptions] = useState(false)
    const [showAddPlaylist, setShowAddPlaylist] = useState(false)
    const toggleSongOptions = () => setSongOptions(!showSongOptions)
    const toggleAddPlaylist = () => setShowAddPlaylist(!showAddPlaylist)

    const { downloadFile, deleteFile } = useDownloadContext();

    const database = useSQLiteContext()
    const [songDownloaded, setSongDownloaded] = useState<Song[]>([]);
    useEffect(() => {
        const fetchData = async() => {
            try {
                const songs: Song[] = await database.getAllAsync(`SELECT * FROM songs`)
                setSongDownloaded(songs)
            } catch (error: any) {
                console.error(error)
            }
        }
        fetchData().catch(console.error)
    }, [])

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (favoriteSong) {
            const isArtistInFavorites = favoriteSong.some(item => item.song_id === Number(audioContext.currentSong?.song_id));
            setIsFavorite(isArtistInFavorites);
        }
    }, [favoriteSong, audioContext.currentSong?.song_id]);

    const [isDownloaded, setIsDownloaded] = useState(false)

    useEffect(() => {
        if (songDownloaded) {
            const isSongDownloaded = songDownloaded.some(item => item.song_id === audioContext.currentSong?.song_id)
            setIsDownloaded(isSongDownloaded)
        }
    }, [songDownloaded, audioContext.currentSong?.song_id]);

    const handleDownload = async () => {
        const song = audioContext.currentSong
        if (!song) {
            return
        }
        try {
            await downloadFile(song)
            setIsDownloaded(true)
        } catch (error: any) {
            console.log(error)
        }
    };

    const handleDeleteDownload = async () => {
        const song = audioContext.currentSong
        if (!song) {
            return
        }
        try {
            await deleteFile(song)
            setIsDownloaded(false)
        } catch (error: any) {
            console.log(error)
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (audioContext.currentSong) {
                if (audioContext.currentSong?.duration) {
                    const position = await audioContext.getCurrentPosition();
                    setSliderValue(position);
                } else {
                    setSliderValue(0)
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [audioContext]);

    const handleSliderChange = async (newPosition: number) => {
        if (!audioContext.loading) {
            setSliderValue(newPosition);
            await audioContext.setPosition(newPosition);
        }
    };

    const handleAddSong = () => {
        addSong({
            user_id: user?.user_id,
            song_id: Number(audioContext.currentSong?.song_id),
        }).then(() => {
            setIsFavorite(true);
        }).catch(error => {
            console.error("Error adding song:", error);
        });
    };

    const handleDeleteSong = () => {
        deleteSong().then(() => {
            setIsFavorite(false);
        }).catch(error => {
            console.error("Error deleting song:", error);
        });
    };

    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            <View style={styles.topAppBar}>
                <Pressable style={styles.buttonAppBar} onPress={() => router.back()}>
                    <FontAwesome6 name="chevron-left" size={20} color="black"/>
                </Pressable>
                <Text numberOfLines={1} style={defaultStyle.header}>
                    {audioContext.currentSong?.title}
                </Text>
                <Pressable style={styles.buttonAppBar} onPress={toggleSongOptions}>
                    <FontAwesome6 name="ellipsis-vertical" size={20} color="black"/>
                </Pressable>
            </View>
            <FloatingDownload />
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: audioContext.currentSong?.image}}
                        priority="normal"
                        style={{...styles.image}}
                        contentFit='cover'
                    />
                </View>
                <View style={styles.infoAndFavorite}>
                    <View style={styles.songAndArtist}>
                        <Text numberOfLines={1} style={defaultStyle.title}>
                            {audioContext.currentSong?.title}
                        </Text>
                        <Text numberOfLines={1} onPress={() => router.push(`/artists/${dataArtist?.artist_id}`)} style={defaultStyle.subtitle}>
                            {dataArtist?.name}
                        </Text>
                    </View>
                    <View style={styles.options}>
                        { isDownloaded ?
                            <Pressable onPress={() => handleDeleteDownload()}>
                                <MaterialIcons name="file-download-off" size={24} color="red" />
                            </Pressable> :
                            <Pressable onPress={() => handleDownload()}>
                                <MaterialIcons name="file-download" size={24} color="black" />
                            </Pressable>
                        }
                        { isFavorite ?
                            <Pressable onPress={() => handleDeleteSong()}>
                                <MaterialIcons name="favorite" size={20} color="red" />
                            </Pressable> :
                            <Pressable onPress={() => handleAddSong()}>
                                <MaterialIcons name="favorite-border" size={20} color="black" />
                            </Pressable>
                        }
                    </View>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={!audioContext.loading ? audioContext.currentSong?.duration : 1}
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#8B5DFF"
                    maximumTrackTintColor="#000000"
                    thumbTintColor={'#8B5DFF'}
                />
                <View style={styles.time}>
                    <Text>{formatTime(sliderValue)}</Text>
                    <Text>{!audioContext.loading ? formatTime(audioContext.currentSong?.duration) : '--:--'}</Text>
                </View>
                <View style={styles.controller}>
                    <Pressable>
                        <FontAwesome6 name="shuffle" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={audioContext.playPrevious}>
                        <FontAwesome6 name="backward" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={audioContext.isPlaying ? audioContext.pause : audioContext.resume}>
                        {audioContext.isPlaying ? (
                            <FontAwesome6 name="pause" size={24} color="black" />
                        ) : (
                            <FontAwesome6 name="play" size={24} color="black" />
                        )}
                    </Pressable>
                    <Pressable onPress={audioContext.playNext}>
                        <FontAwesome6 name="forward" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={() => {
                            setIsRepeating(!isRepeating);
                            audioContext.toggleRepeat(!isRepeating);
                        }}>
                        <FontAwesome6 name="repeat" size={20} color={isRepeating ? "#8B5DFF" : "black"}/>
                    </Pressable>
                </View>
            </View>
            <SongOptions addPlaylist={toggleAddPlaylist} artist={dataArtist} song={audioContext.currentSong} visible={showSongOptions} onClose={toggleSongOptions} />
            <AddToPlaylistModal visible={showAddPlaylist} onClose={toggleAddPlaylist} song={audioContext.currentSong} />
        </View>
    )
}

const styles = StyleSheet.create({
    topAppBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonAppBar: {
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        borderRadius: 10,
        width: 40,
        height: 40
    },
    contentContainer: {
        padding: 10,
        flex: 1,
        gap: 20
    },
    imageContainer: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.44,
        shadowRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: "center",
        height: '50%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        borderRadius: 12
    },
    infoAndFavorite: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
    options: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    slider: {
        width: '110%',
        alignSelf: 'center'
    },
    time: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    controller: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    }
})

export default SongScreen