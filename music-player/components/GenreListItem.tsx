import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text} from "react-native";
import {Image} from "expo-image";
import {defaultStyle} from "@/constants/styles";
import {generateGenreColor} from "@/utils/generateColor";
import {router} from "expo-router";

type Props = {
    genre: Genre
}

const GenreListItem = ({genre}: Props) => {
    const backgroundColor = useMemo(() => generateGenreColor(genre.genre_id), [genre.genre_id]);
    return (
        <Pressable onPress={() => router.push(`/genre/${genre.genre_id}`)} style={{...styles.container, backgroundColor: backgroundColor}}>
            <Text style={styles.text}>{genre.name}</Text>
            <Image
                source={{uri: genre.image}}
                priority="normal"
                style={styles.image}
                contentFit="cover"
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: '48.5%',
        height: 80,
        borderRadius: 10,
        overflow: "hidden"
    },
    text: {
        ...defaultStyle.title,
        color: "white",
        padding: 10
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        position: 'absolute',
        transform: [{
            rotateZ: '-60deg'
        }],
        right: -8,
        bottom: 0
    }
})

export default GenreListItem;