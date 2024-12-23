import React, {useEffect, useMemo, useState} from 'react'
import {ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import {router, useLocalSearchParams, useNavigation} from "expo-router";
import useSearch from "@/hooks/useSearch";
import FloatingPlayer from "@/components/FloatingPlayer";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "@/constants/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {useAuthContext} from "@/context/AuthContext";
import SongListItem from "@/components/SongListItem";
import {useAudioContext} from "@/context/AudioContext";

const AlbumScreen = () => {
    const {album: albumId} = useLocalSearchParams<{ album: string }>()
    const { user } = useAuthContext()
    const { album, setAlbum, handlePlaySongList, isShuffle, handleShuffle, songList, currentSong} = useAudioContext()
    const { data: dataAlbum } = useFetch<Album>(BASE_URL + `albums/by_id?album_id=${albumId}`)
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${dataAlbum?.artist_id}`)
    const { data: dataSongs, loading: loadingSongs, error: errorSongs } = useFetch<Song[]>(BASE_URL + `songs/by_album?album_id=${albumId}`)
    const { data: favoriteAlbum } = useFetch<FavoriteAlbum[]>(BASE_URL + `favorites/albums?user_id=${user?.user_id}`)
    const { postData: addAlbum } = useFetch(BASE_URL + `favorites/albums/add`)
    const { deleteData: deleteAlbum } = useFetch(BASE_URL + `favorites/albums/delete?user_id=${user?.user_id}&album_id=${albumId}`)
    const navigation = useNavigation()
    const [isPlaying, setIsPlaying] = useState(Number(albumId) === album?.album_id)
    const [allowShuffle, setAllowShuffle] = useState<boolean>(false)

    useEffect(() => {
        setAllowShuffle(
            !(currentSong &&
                !songList.map(item => item.song_id).includes(currentSong?.song_id) ||
                album === undefined) && isPlaying
        )
    }, [album, currentSong, songList]);

    const playAlbum = () => {
        if (isPlaying) {
            setAlbum(undefined)
            handlePlaySongList().catch(console.error)
        } else {
            setAlbum(dataAlbum)
            handlePlaySongList(dataSongs).catch(console.error)
        }
        setIsPlaying(prev => !prev)
    }

    useEffect(() => {
        navigation.setOptions({
            title: dataAlbum?.title || 'Album',
            // header: () => null
        })
    }, [dataAlbum])
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Find in albums',
        }
    });

    const filteredTracks = useMemo(() => {
        if (!search) return dataSongs ?? [];
        const searchLower = search.toLowerCase();
        return dataSongs ? dataSongs.filter(track => track.title.toLowerCase().includes(searchLower)) : [];
    }, [dataSongs, search]);

    if (errorSongs) {
        Alert.alert("Error", errorSongs.message);
        return null;
    }

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (favoriteAlbum) {
            const isArtistInFavorites = favoriteAlbum.some(item => item.album_id === Number(albumId));
            setIsFavorite(isArtistInFavorites);
        }
    }, [favoriteAlbum, albumId]);

    const handleAddAlbum = () => {
        addAlbum({
            user_id: user?.user_id,
            album_id: Number(albumId),
        }).then(() => {
            setIsFavorite(true);
        }).catch(error => {
            console.error("Error adding artist:", error);
        });
    };

    const handleDeleteAlbum = () => {
        deleteAlbum().then(() => {
            setIsFavorite(false);
        }).catch(error => {
            console.error("Error deleting artist:", error);
        });
    };

    return (
        <View style={{...defaultStyle.container}}>
            {(!search) && <View style={styles.header}>
                <Image
                    style={styles.image}
                    source={{uri: dataAlbum?.image}}
                    priority="normal" contentFit={"cover"}
                />
                <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.backgroundImage}/>
                <View style={styles.albumAndArtist}>
                    <Text style={{...defaultStyle.header, color: 'white', width: '100%'}} numberOfLines={1}>{dataAlbum?.title || "Unknown Title"}</Text>
                    <Text style={defaultStyle.subtitle} onPress={() => router.push(`/artists/${dataAlbum?.artist_id}`)} numberOfLines={1}>{dataArtist?.name || "Unknown Artist"}</Text>
                </View>
            </View>}
            <View style={styles.option}>
                { isFavorite ?
                    <Pressable style={{...styles.editArtist, borderColor: 'red'}} onPress={() => handleDeleteAlbum()}>
                        <MaterialIcons name="album" size={24} color="red" />
                        <Text style={{ color: colors.error }}>Delete Album</Text>
                    </Pressable> :
                    <Pressable style={styles.editArtist} onPress={() => handleAddAlbum()}>
                        <MaterialIcons name="album" size={24} color="black" />
                        <Text>Add Album</Text>
                    </Pressable>
                }
                <View style={styles.activeOption}>
                    <Pressable
                        onPress={() => handleShuffle()}
                        disabled={!allowShuffle}
                    >
                        <FontAwesome6 name="shuffle" size={20} color={allowShuffle ? (isShuffle ? "#8B5DFF" : "black") : "gray"} />
                    </Pressable>
                    <Pressable onPress={() => playAlbum()}>
                        <FontAwesome6 name={isPlaying ? "pause" : "play"} size={24} color={isPlaying ? "#8B5DFF" : "black"}/>
                    </Pressable>
                </View>
            </View>
            {loadingSongs ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={filteredTracks}
                    keyExtractor={(item) => item.song_id.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                    renderItem={({item}) => (
                        <SongListItem song={item} />
                    )}
                />
            )}
            <FloatingPlayer />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 250,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: "absolute",
        top: 0,
        left: 0
    },
    albumAndArtist: {
        width: '100%',
        color: 'white',
        position: "absolute",
        bottom: 10,
        left: 10
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    editArtist: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        borderWidth: 1,
        padding: 5
    },
    activeOption: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        padding: 5
    },
})

export default AlbumScreen