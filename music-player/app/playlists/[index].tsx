import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {ActivityIndicator, Alert, Animated, FlatList, Pressable, StyleSheet, View} from 'react-native'
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import axios from "axios";
import {AntDesign} from "@expo/vector-icons";
import {defaultStyle} from "@/constants/styles";
import AddFavorite from "@/components/AddFavorite";
import {Swipeable} from "react-native-gesture-handler";
import colors from "@/constants/colors";
import SongListItem from "@/components/SongListItem";
import SearchBar from "@/components/SearchBar";
import FloatingPlayer from "@/components/FloatingPlayer";
import {useFocusEffect, useLocalSearchParams, useNavigation} from "expo-router";
import useSearch from "@/hooks/useSearch";

const PlaylistScreen = () => {
    const { index } = useLocalSearchParams<{ index: string }>()
    const { data: playlist } = useFetch<Playlist>(BASE_URL + `playlists/by_id?playlist_id=${index}`)
    const { data, loading, error, reFetchData } = useFetch<Song[]>(BASE_URL + `playlists/songs?playlist_id=${index}`)
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            reFetchData()
        }, [])
    )

    useEffect(() => {
        navigation.setOptions({
            title: playlist?.name || 'Playlist',
            // header: () => null
        })
    }, [data])

    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Find in playlist',
        }
    });

    const filteredTracks = useMemo(() => {
        if (!search) return data ?? [];
        const searchLower = search.toLowerCase();
        return data ? data.filter(track => track.title.toLowerCase().includes(searchLower)) : [];
    }, [data, search]);

    const [isSearching, setIsSearching] = useState(false)

    const handleAdd = () => {
        setIsSearching(!isSearching)
    }

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    const handleDelete = async (item: Song) => {
        try {
            await axios.delete(BASE_URL + `playlists/songs/delete?playlist_id=${index}&song_id=${item.song_id}`);
            reFetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    const renderRightActions = (
        progress:  Animated.AnimatedInterpolation<string | number>,
        dragX: Animated.AnimatedInterpolation<string | number>,
        item: Song
    ) => {
        return (
            <View style={styles.rightAction}>
                <Pressable onPress={() => handleDelete(item)}>
                    <AntDesign name="delete" size={24} color="white" />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={defaultStyle.container}>
            <AddFavorite text={'Add Song'} icon={'queue-music'} onPress={handleAdd} />
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={filteredTracks}
                    keyExtractor={(item) => item.song_id.toString()}
                    renderItem={({item}) =>
                        <Swipeable
                            childrenContainerStyle={{backgroundColor: colors.background}}
                            renderRightActions={(progress, dragX) =>
                                renderRightActions(progress, dragX, item)
                            }
                            overshootLeft={false}
                        >
                            <SongListItem song={item}/>
                        </Swipeable>
                    }
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                />
            )}
            <SearchBar type={'song'} visible={isSearching} onClose={() => handleAdd()} />
            <FloatingPlayer />
        </View>
    );
};

const styles = StyleSheet.create({
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 50,
        height: '100%',
    },
})

export default PlaylistScreen;