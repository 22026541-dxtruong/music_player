import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import favicon from "@/assets/images/favicon.png";
import {useAudioContext} from "@/context/AudioContext";

type Props = {
    song: Song
};

const SongListItem = ({song}: Props) => {
    const audioContext = useAudioContext()
    return (
        <Pressable style={styles.container} disabled={song.song_id === audioContext.currentSong?.song_id} onPress={() => {
            audioContext.play(song).catch(console.error)
        }}>
            <Image
                source={song.image ? {uri: song.image} : favicon}
                priority="normal"
                style={{...styles.image, opacity: song.song_id === audioContext.currentSong?.song_id ? 0.6 : 1}}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>{song.title}</Text>
                <Text numberOfLines={1} style={defaultStyle.subtitle}>{song.artist_id}</Text>
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

export default SongListItem;