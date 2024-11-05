import React, {useEffect, useMemo} from 'react'
import {ActivityIndicator, Alert, ScrollView, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import {useLocalSearchParams, useNavigation} from "expo-router";
import useSearch from "@/hooks/useSearch";
import SongList from "@/components/SongList";
import FloatingPlayer from "@/components/FloatingPlayer";

const AlbumScreen = () => {
    const {index} = useLocalSearchParams<{ index: string }>()
    const { data: dataAlbum } = useFetch<Album>(BASE_URL + `albums/by_id?album_id=${index}`)
    const { data: dataSongs, loading: loadingSongs, error: errorSongs } = useFetch<Song[]>(BASE_URL + `songs/by_album?album_id=${index}`)
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            title: dataAlbum?.title || 'Album',
        })
    }, [dataAlbum])
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Find in album',
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

    return (
        <View style={{...defaultStyle.container}}>
            {loadingSongs ? (
                <ActivityIndicator size={"large"} color={"blue"} />
            ) : (
                <ScrollView contentInsetAdjustmentBehavior={"automatic"}>
                    <SongList tracks={filteredTracks} />
                </ScrollView>
            )}
            <FloatingPlayer />
        </View>
    );
}

export default AlbumScreen