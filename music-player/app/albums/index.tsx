import {useSafeAreaInsets} from "react-native-safe-area-context";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import useSearch from "@/hooks/useSearch";
import React, {useMemo} from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import FloatingPlayer from "@/components/FloatingPlayer";
import AlbumListItem from "@/components/AlbumListItem";

const AlbumList = () => {
    const inset = useSafeAreaInsets()
    const { data, loading, error } = useFetch<Album[]>(BASE_URL + 'albums')
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Search albums',
        }
    });

    const filteredAlbum = useMemo(() => {
        if (!search) return data ?? [];
        const searchLower = search.toLowerCase();
        return data ? data.filter(album => album.title.toLowerCase().includes(searchLower)) : [];
    }, [data, search]);

    if (error) return <Text style={defaultStyle.error}>{error.message}</Text>

    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={filteredAlbum}
                    keyExtractor={(item) => item.album_id.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                    renderItem={({item}) => (
                        <AlbumListItem album={item} />
                    )}
                />
            )}
            <FloatingPlayer />
        </View>
    )
}

export default AlbumList