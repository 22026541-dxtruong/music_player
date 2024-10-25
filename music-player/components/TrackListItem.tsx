import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import favicon from "@/assets/images/favicon.png";

type Props = {
    track: {
        title: string;
        image?: string;
        artist?: string;
    };
};

const TrackListItem = ({track}: Props) => {
    const isActiveTrack = false;

    return (
        <Pressable style={styles.container}>
            <Image
                source={track.image ? {uri: track.image} : favicon}
                priority="normal"
                style={{...styles.image, opacity: isActiveTrack ? 0.6 : 1}}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>
                    {track.title}
                </Text>
                {track.artist && (
                    <Text numberOfLines={1} style={defaultStyle.subtitle}>
                        {track.artist}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 14,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
});

export default TrackListItem;
