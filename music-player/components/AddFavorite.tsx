import React from 'react';
import {Pressable, StyleSheet, Text, View} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {defaultStyle} from "@/constants/styles";

type Props = {
    text: string,
    icon: 'album' | 'person-add' | 'playlist-add' | 'queue-music',
    onPress: () => void
}

const AddFavorite = ({text, icon, onPress}: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.image}>
                <MaterialIcons name={icon} size={24} color="white"/>
            </View>
            <Text numberOfLines={1} style={defaultStyle.title}>{text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingTop: 10
    },
    image: {
        backgroundColor: 'black',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    }
});

export default AddFavorite;