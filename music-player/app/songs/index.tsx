import SongList from '@/components/SongList';
import React, { useMemo } from 'react';
import {ActivityIndicator, Alert, ScrollView, View} from "react-native";
import { defaultStyle } from "@/constants/styles";
import useSearch from "@/hooks/useSearch";
import FloatingPlayer from "@/components/FloatingPlayer";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';

const SongListScreen = () => {
    const { data, loading, error } = useFetch<Song[]>(BASE_URL + 'songs');
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Find in songs',
        },
    });

    const filteredTracks = useMemo(() => {
        if (!search) return data ?? [];
        const searchLower = search.toLowerCase();
        return data ? data.filter(track => track.title.toLowerCase().includes(searchLower)) : [];
    }, [data, search]);

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    return (
        <View style={defaultStyle.container}>
            {loading ? (
                <ActivityIndicator size={"large"} color={"blue"} />
            ) : (
                <ScrollView contentInsetAdjustmentBehavior={"automatic"}>
                    <SongList tracks={filteredTracks} />
                </ScrollView>
            )}
            <FloatingPlayer />
        </View>
    );
};

export default SongListScreen;