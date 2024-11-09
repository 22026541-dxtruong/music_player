import {Pressable, StyleSheet, Text} from "react-native";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import {defaultStyle} from "@/constants/styles";
import {router} from "expo-router";

type Props = {
    artist: Artist
}

const CircleArtist = ({artist}: Props) => {
    return (
        <Pressable style={styles.container} onPress={() => router.push(`/artists/${artist.artist_id}`)}>
            <Image style={styles.image} source={artist.image ? {uri: artist.image} : favicon} priority="normal"  />
            <Text style={{...defaultStyle.title, fontSize: 12}}>{artist.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: 5
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
})

export default CircleArtist