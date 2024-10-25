import TrackList from '@/components/TrackList'
import React, {useMemo} from 'react'
import {ScrollView, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import useSearch from "@/hooks/useSearch";
import fakeData from "@/assets/data/fake.json";

const SongListScreen = () => {
    const search = useSearch({
        searchBarOptions: {
            placeholder: 'Find in songs',
        },
    })

    const filteredTracks = useMemo(() => {
        if (!search) return fakeData

        return fakeData.filter(track => track.title.toLowerCase().includes(search.toLowerCase()))
    }, [search])

    return (
        <View style={defaultStyle.container}>
            <ScrollView
                contentInsetAdjustmentBehavior={"automatic"}
            >
                <TrackList tracks={filteredTracks} />
            </ScrollView>
        </View>
    )
}

export default SongListScreen