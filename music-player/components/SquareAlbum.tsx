import {Pressable, StyleSheet, Text} from "react-native";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import {defaultStyle} from "@/constants/styles";
import {router} from "expo-router";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";

type Props = {
    album: Album
}

const SquareAlbum = ({album}: Props) => {
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${album.artist_id}`)
    return (
        <Pressable style={styles.container} onPress={() => router.push(`/album/${album.album_id}`)}>
            <Image style={styles.image} source={album.image ? {uri: album.image} : favicon} priority="normal"  />
            <Text style={{...defaultStyle.title, fontSize: 12}}>{album.title}</Text>
            <Text style={{...defaultStyle.subtitle}}>{dataArtist?.name || ''}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 5
    },
    image: {
        width: 100,
        height: 100,
    },
})

export default SquareAlbum