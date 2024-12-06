import { Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import favicon from "@/assets/images/favicon.png";
import { defaultStyle } from "@/constants/styles";
import { router } from "expo-router";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from "@/constants/constants";

type Props = {
    album: Album;
};

const SquareAlbum = ({ album }: Props) => {
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${album.artist_id}`);

    // const translateX = useSharedValue(0);
    //
    // const marqueeText = useAnimatedStyle(() => ({
    //     transform: [{ translateX: translateX.value }],
    // }));
    //
    // useEffect(() => {
    //     translateX.value = withRepeat(
    //         withTiming(-100, {
    //             duration: 5000,
    //             easing: Easing.linear,
    //         }),
    //         -1,
    //         false
    //     );
    // }, [translateX]);

    return (
        <Pressable style={styles.container} onPress={() => router.push(`/albums/${album.album_id}`)}>
            <Image style={styles.image} source={album.image ? { uri: album.image } : favicon} priority="normal" />
            <Text numberOfLines={1} style={[styles.text]}>{album.title}</Text>
            <Text style={defaultStyle.subtitle}>{dataArtist?.name || ''}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 5,
        overflow: "hidden",
    },
    image: {
        width: 100,
        height: 100,
    },
    text: {
        width: 100,
        ...defaultStyle.title,
        fontSize: 12,
        overflow: "scroll"
    },
});

export default SquareAlbum;
