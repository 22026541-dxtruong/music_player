import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import {useAudioContext} from "@/context/AudioContext";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";
import {router} from "expo-router";

type Props = {
    song: Song
    artist?: Artist
    onPress?: () => void
};

const SongListItem = ({song, artist, onPress}: Props) => {
    const audioContext = useAudioContext()
    const { data: dataArtist } = artist
        ? { data: artist }
        : useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${song?.artist_id}`);

    const playSong = () => {
        audioContext.play(song).catch(console.error)
        router.navigate(`/songs/${audioContext.currentSong?.song_id}`)
        if (audioContext.album !== undefined && !audioContext.songList.map(item => item.song_id).includes(song.song_id)) {
            audioContext.handlePlaySongList().catch(console.error)
            audioContext.setAlbum(undefined)
        }
    }

    return (
        <Pressable style={styles.container} disabled={song.song_id === audioContext.currentSong?.song_id} onPress={() => {
            playSong()
            onPress?.()
        }}>
            <Image
                source={song.image}
                priority="normal"
                style={{...styles.image, opacity: song.song_id === audioContext.currentSong?.song_id ? 0.6 : 1}}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>{song.title}</Text>
                <Text numberOfLines={1} style={defaultStyle.subtitle}>{dataArtist?.name}</Text>
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
        borderRadius: 15,
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
});

export default SongListItem;