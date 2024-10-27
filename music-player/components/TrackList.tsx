import React from "react";
import {FlatList, View} from "react-native";
import TrackListItem from "./TrackListItem";
import {Track} from "@/hooks/useAudio";

type Props = {
    tracks: Track[]
}

const TrackList = ({tracks}: Props) => {
    return (
        <FlatList
            data={tracks}
            contentContainerStyle={{paddingBottom: 64}}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
            renderItem={({item: track}) => (
                <TrackListItem track={track} />
            )}
        />
    );
};

export default TrackList;
