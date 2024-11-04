import React from "react";
import {FlatList, View} from "react-native";
import SongListItem from "./SongListItem";

type Props = {
    tracks: Song[]
}

const SongList = ({tracks}: Props) => {
    return (
        <FlatList
            data={tracks}
            scrollEnabled={false}
            keyExtractor={(item) => item.song_id.toString()}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
            renderItem={({item}) => (
                <SongListItem song={item} />
            )}
        />
    );
};

export default SongList;
