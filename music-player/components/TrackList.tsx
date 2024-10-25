import React from "react";
import {FlatList, View} from "react-native";
import fakeData from "@/assets/data/fake.json";
import TrackListItem from "./TrackListItem";

type Props = {
    tracks: any[]
}

const TrackList = ({tracks}: Props) => {
    return (
        <FlatList
            data={tracks}
            contentContainerStyle={{paddingBottom: 64}}
            scrollEnabled={false}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
            keyExtractor={(item) => item.title}
            renderItem={({item: track}) => (
                <TrackListItem track={{...track, image: track.artwork}}/>
            )}
        />
    );
};

export default TrackList;
