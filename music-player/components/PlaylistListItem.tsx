import React, {useCallback} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import {router, useFocusEffect} from "expo-router";
import playlistLogo from '@/assets/images/playlist-logo.jpg'
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";

type Props = {
    playlist: Playlist
    onPress?: () => void
};

const PlaylistListItem = ({playlist, onPress}: Props) => {
    const { data, reFetchData } = useFetch<PlaylistSong[]>(BASE_URL + `playlists/songs?playlist_id=${playlist.playlist_id}`)
    useFocusEffect(
        useCallback(() => {
            reFetchData()
        }, [])
    )
    return (
        <Pressable style={styles.container} onPress={() => {
            router.push(`/playlists/${playlist.playlist_id}`)
            onPress?.()
        }}>
            <Image
                source={playlistLogo}
                priority="normal"
                style={styles.image}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>{playlist.name}</Text>
                <Text numberOfLines={1} style={defaultStyle.subtitle}>{`${data ? data.length : `?`} songs`}</Text>
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

export default PlaylistListItem;