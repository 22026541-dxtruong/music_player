import React, {useCallback, useEffect, useState} from 'react'
import {
    ActivityIndicator, Animated,
    FlatList, Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import FloatingDownload from "@/components/FloatingDownload";
import {useAuthContext} from "@/context/AuthContext";
import {DrawerToggleButton} from "@react-navigation/drawer";
import CircleAvatar from "@/components/CircleAvatar";
import Chip from "@/components/Chip";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import ArtistListItem from "@/components/ArtistListItem";
import AlbumListItem from "@/components/AlbumListItem";
import {useFocusEffect} from "expo-router";
import {Swipeable} from "react-native-gesture-handler";
import colors from "@/constants/colors";
import {AntDesign} from "@expo/vector-icons";
import axios from "axios";
import PlaylistListItem from "@/components/PlaylistListItem";
import FavoriteSongItem from "@/components/FavoriteSongItem";
import SearchBar from "@/components/SearchBar";
import AddFavorite from "@/components/AddFavorite";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";

const LibraryScreen = () => {
    const { user } = useAuthContext();
    const [chooseArtist, setChooseArtist] = useState(false);
    const [chooseAlbum, setChooseAlbum] = useState(false);
    const [choosePlaylist, setChoosePlaylist] = useState(false);
    const [isSearching, setIsSearching] = useState(false)
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)

    const { data: dataArtist, loading: loadingArtist, error: errorArtist, reFetchData: reFetchArtist } = useFetch<Artist[]>(BASE_URL + `favorites/artists?user_id=${user?.user_id}`);
    const { data: dataAlbum, loading: loadingAlbum, error: errorAlbum, reFetchData: reFetchAlbum } = useFetch<Album[]>(BASE_URL + `favorites/albums?user_id=${user?.user_id}`);
    const { data: dataPlaylist, loading: loadingPlaylist, error: errorPlaylist, reFetchData: reFetchPlaylist } = useFetch<Playlist[]>(BASE_URL + `playlists/by_user?user_id=${user?.user_id}`);

    const toggleCreatePlaylist = () => {
        setShowCreatePlaylist(!showCreatePlaylist);
    }

    useEffect(() => {
        reFetchPlaylist()
    }, [showCreatePlaylist]);

    const [type, setType] = useState<'artist' | 'album' | undefined>(undefined)

    useFocusEffect(
        useCallback(() => {
            reFetchArtist()
            reFetchAlbum()
            reFetchPlaylist()
        }, [])
    );

    const handleDelete = async (item: Artist | Album | Playlist) => {
        let deleteUrl: string | null = null;
        if ('album_id' in item) {
            deleteUrl = BASE_URL + `favorites/albums/delete?user_id=${user?.user_id}&album_id=${item.album_id}`;
        } else if ('artist_id' in item) {
            deleteUrl = BASE_URL + `favorites/artists/delete?user_id=${user?.user_id}&artist_id=${item.artist_id}`;
        } else if ('playlist_id' in item) {
            deleteUrl = BASE_URL + `playlists/delete?playlist_id=${item.playlist_id}`
        }

        if (deleteUrl) {
            try {
                await axios.delete(deleteUrl);
                if ('album_id' in item) {
                    reFetchAlbum();
                } else if ('artist_id' in item) {
                    reFetchArtist();
                } else if ('playlist_id' in item) {
                    reFetchPlaylist();
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    }

    const renderRightActions = (
        progress:  Animated.AnimatedInterpolation<string | number>,
        dragX: Animated.AnimatedInterpolation<string | number>,
        item: Artist | Album | Playlist
    ) => {
        return (
            <View style={styles.rightAction}>
                <Pressable onPress={() => handleDelete(item)}>
                    <AntDesign name="delete" size={24} color="white" />
                </Pressable>
            </View>
        );
    };

    const handleChoose = (selection: string) => {
        if (selection === 'artist') {
            setChooseArtist(true);
            setChooseAlbum(false);
            setChoosePlaylist(false);
        } else if (selection === 'album') {
            setChooseArtist(false);
            setChooseAlbum(true);
            setChoosePlaylist(false);
        } else if (selection === 'playlist') {
            setChooseArtist(false);
            setChooseAlbum(false);
            setChoosePlaylist(true);
        } else if (selection === 'filter') {
            setChooseArtist(false);
            setChooseAlbum(false);
            setChoosePlaylist(false);
        }
    };

    const handleAdd = (selection?: 'artist' | 'album') => {
        setIsSearching(!isSearching)
        setType(selection)
    }

    const renderArtists = useCallback(() => {
        if (errorArtist) return <Text style={defaultStyle.error}>Artists: {errorArtist.message}</Text>
        return (
            <FlatList
                data={dataArtist}
                contentContainerStyle={{ paddingTop: 10 }}
                keyExtractor={(item) => item.artist_id.toString()}
                scrollEnabled={false}
                renderItem={({item}) =>
                    <Swipeable
                        childrenContainerStyle={{backgroundColor: colors.background}}
                        renderRightActions={(progress, dragX) =>
                            renderRightActions(progress, dragX, item)
                        }
                        overshootLeft={false}
                    >
                        <ArtistListItem artist_id={item.artist_id}/>
                    </Swipeable>
                }
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
            />
        )
    }, [dataArtist, errorArtist])

    const renderAlbums = useCallback(() => {
        if (errorAlbum) return <Text style={defaultStyle.error}>Albums: {errorAlbum.message}</Text>
        return (
            <FlatList
                data={dataAlbum}
                contentContainerStyle={{ paddingTop: 10 }}
                keyExtractor={(item) => item.album_id.toString()}
                scrollEnabled={false}
                renderItem={({item}) =>
                    <Swipeable
                        childrenContainerStyle={{backgroundColor: colors.background}}
                        renderRightActions={(progress, dragX) =>
                            renderRightActions(progress, dragX, item)
                        }
                        overshootLeft={false}
                    >
                        <AlbumListItem album_id={item.album_id}/>
                    </Swipeable>
                }
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
            />
        )
    }, [dataAlbum, errorAlbum])

    const renderPlaylist = useCallback(() => {
        if (errorPlaylist) return <Text style={defaultStyle.error}>Playlists: {errorPlaylist.message}</Text>
        return (
            <FlatList
                data={dataPlaylist}
                contentContainerStyle={{ paddingTop: 10 }}
                keyExtractor={(item) => item.playlist_id.toString()}
                scrollEnabled={false}
                renderItem={({item}) =>
                    <Swipeable
                        childrenContainerStyle={{backgroundColor: colors.background}}
                        renderRightActions={(progress, dragX) =>
                            renderRightActions(progress, dragX, item)
                        }
                        overshootLeft={false}
                    >
                        <PlaylistListItem playlist={item}/>
                    </Swipeable>
                }
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
            />
        )
    }, [dataPlaylist, errorPlaylist])

    return (
        <View style={defaultStyle.container}>
            <View style={styles.header}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <DrawerToggleButton tintColor={'transparent'}/>
                    <CircleAvatar size={35} style={{ position: "absolute", zIndex: -1}}/>
                </View>
                <Text style={{...defaultStyle.header, flexGrow: 1}}>Your Library</Text>
            </View>
            <FloatingDownload />
            <View style={styles.chips}>
                { choosePlaylist || chooseArtist || chooseAlbum ?
                    <MaterialIcons name="cancel" size={30} color="#CB9DF0" onPress={() => handleChoose('filter')} /> :
                    <Feather name="filter" style={{paddingHorizontal: 3}} size={24} color="black" />
                }
                <Chip text={'Artist'} choose={chooseArtist} onPress={() => handleChoose('artist')} />
                <Chip text={'Album'} choose={chooseAlbum} onPress={() => handleChoose('album')} />
                <Chip text={'Playlist'} choose={choosePlaylist} onPress={() => handleChoose('playlist')} />
            </View>
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
            >
                <FavoriteSongItem />

                {(chooseArtist || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && <AddFavorite text={'Add Artist'} icon={'person-add'} onPress={() => handleAdd('artist')} />}
                {(chooseAlbum || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && <AddFavorite text={'Add Album'} icon={'album'} onPress={() => handleAdd('album')} />}
                {(choosePlaylist || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && <AddFavorite text={'Create Playlist'} icon={'playlist-add'} onPress={toggleCreatePlaylist} />}

                { loadingArtist && loadingAlbum && loadingPlaylist && <ActivityIndicator size={"large"} color={"blue"}/> }
                { (chooseArtist || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && renderArtists() }
                { (chooseAlbum || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && renderAlbums() }
                { (choosePlaylist || (!chooseArtist && !chooseAlbum && !choosePlaylist)) && renderPlaylist() }
            </ScrollView>
            <CreatePlaylistModal visible={showCreatePlaylist} onClose={toggleCreatePlaylist} />
            <SearchBar visible={isSearching} onClose={() => handleAdd()} type={type} />
            <FloatingPlayer />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 10,
        height: 35,
        width: '100%',
        alignItems: "center",
        marginBottom: 10
    },
    chips: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginBottom: 5
    },
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 50,
        height: '100%',
    },
})

export default LibraryScreen