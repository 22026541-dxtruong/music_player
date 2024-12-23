import React, {useMemo} from 'react'
import {ActivityIndicator, FlatList, Text, View} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import useSearch from "@/hooks/useSearch";
import FloatingPlayer from "@/components/FloatingPlayer";
import ArtistListItem from "@/components/ArtistListItem";

const ArtistList = () => {
    const inset = useSafeAreaInsets()
    const { data, loading, error } = useFetch<Artist[]>(BASE_URL + 'artists')
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Search artists',
        }
    });

    const filteredArtist = useMemo(() => {
        if (!search) return data ?? [];
        const searchLower = search.toLowerCase();
        return data ? data.filter(artist => artist.name.toLowerCase().includes(searchLower)) : [];
    }, [data, search]);

    if (error) return <Text style={defaultStyle.error}>{error.message}</Text>

    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={filteredArtist}
                    keyExtractor={(item) => item.artist_id.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                    renderItem={({item}) => (
                        <ArtistListItem artist={item} />
                    )}
                />
            )}
            <FloatingPlayer />
        </View>
    )
}

export default ArtistList