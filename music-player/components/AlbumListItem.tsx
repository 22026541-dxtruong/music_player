import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import favicon from "@/assets/images/favicon.png";
import {router} from "expo-router";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";

type Props = {
    album: Album
    artist?: Artist
};

const AlbumListItem = ({album, artist}: Props) => {
    const { data: dataArtist } = artist ? { data: artist } : useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${album.artist_id}`)
    return (
        <Pressable style={styles.container} onPress={() => {
            router.push(`/album/${album.album_id}`)
        }}>
            <Image
                source={album.image ? {uri: album.image} : favicon}
                priority="normal"
                style={styles.image}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>{album.title}</Text>
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
        borderRadius: 8,
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
});

export default AlbumListItem;