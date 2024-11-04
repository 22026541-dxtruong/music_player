import React from "react";
import {Pressable, StyleSheet, Text, View,} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import favicon from "@/assets/images/favicon.png";
import {router} from "expo-router";

type Props = {
    album: Album
};

const AlbumListItem = ({album}: Props) => {
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
                <Text numberOfLines={1} style={defaultStyle.subtitle}>{album.artist_id}</Text>
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