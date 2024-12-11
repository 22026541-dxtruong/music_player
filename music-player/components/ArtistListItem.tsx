import React from 'react';
import {router} from "expo-router";
import {Image} from "expo-image";
import {Pressable, StyleSheet, Text} from "react-native";
import {defaultStyle} from "@/constants/styles";

type Props = {
    artist: Artist
    onPress?: () => void
}

const ArtistListItem = ({artist, onPress}: Props) => {
    return (
        <Pressable style={styles.container} onPress={() => {
            router.push(`/artists/${artist.artist_id}`)
            onPress?.()
        }}>
            <Image
                source={artist.image}
                priority="normal"
                style={styles.image}
            />
            <Text numberOfLines={1} style={defaultStyle.title}>{artist.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
    }
});

export default ArtistListItem
