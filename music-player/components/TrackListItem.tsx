import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import favicon from "@/assets/images/favicon.png";
import {Track} from "@/hooks/useAudio";
import {useAudioContext} from "@/context/AudioContext";

type Props = {
    track: Track
};

const TrackListItem = ({track}: Props) => {
    const audioContext = useAudioContext()
    return (
        <Pressable style={styles.container} onPress={() => {
            audioContext.play(track).catch(console.error)
        }}>
            <Image
                source={track.artwork ? {uri: track.artwork} : favicon}
                priority="normal"
                style={{...styles.image, opacity: track.id === audioContext.currentTrack?.id ? 0.6 : 1}}
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
