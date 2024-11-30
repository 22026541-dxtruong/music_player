import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import {router} from "expo-router";
import favoriteSong from '@/assets/images/favorite_song.png'
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import {useAuthContext} from "@/context/AuthContext";

type Props = {
    onPress?: () => void
};

const FavoriteSongItem = ({onPress}: Props) => {
    const { user } = useAuthContext()
    const { data } = useFetch<PlaylistSong[]>(BASE_URL + `favorites/songs?user_id=${user?.user_id}`)
    return (
        <Pressable style={styles.container} onPress={() => {
            router.push(`/songs`)
            onPress?.()
        }}>
            <Image
                source={favoriteSong}
                priority="normal"
                style={styles.image}
            />
            <View style={styles.songAndArtist}>
                <Text numberOfLines={1} style={defaultStyle.title}>Liked Songs</Text>
                <Text numberOfLines={1} style={defaultStyle.subtitle}>{`${data ? data.length : `0`} songs`}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 14,
        paddingTop: 5
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
});

export default FavoriteSongItem;