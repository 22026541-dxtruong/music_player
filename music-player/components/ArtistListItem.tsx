import React from 'react';
import {router} from "expo-router";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import {Pressable, StyleSheet, Text} from "react-native";
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";

type Props = {
    artist_id?: number;
    artist?: Artist
    onPress?: () => void
}

const ArtistListItem = ({artist_id, artist, onPress}: Props) => {
    if (artist_id) {
        const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${artist_id}`);
        artist = dataArtist;
    }
    return (
        <Pressable style={styles.container} onPress={() => {
            if (artist) {
                router.push(`/artists/${artist.artist_id}`)
                onPress?.()
            }
        }}>
            <Image
                source={artist?.image ? {uri: artist.image} : favicon}
                priority="normal"
                style={styles.image}
            />
            <Text numberOfLines={1} style={defaultStyle.title}>{artist?.name}</Text>
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
