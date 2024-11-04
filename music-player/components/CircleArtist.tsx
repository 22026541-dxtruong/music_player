import {Pressable, StyleSheet, Text} from "react-native";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import {defaultStyle} from "@/constants/styles";

type Props = {
    name: string,
    image?: string,
    onPress?: () => void
}

const CircleArtist = ({name, image, onPress}: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Image style={styles.image} source={image ? {uri: image} : favicon} priority="normal"  />
            <Text style={defaultStyle.title}>{name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: 10
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
})

export default CircleArtist