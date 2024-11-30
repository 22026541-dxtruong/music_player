import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";

type Props = {
    text: string,
    choose: boolean,
    onPress: () => void,
}

const Chip = ({text, choose, onPress}: Props) => {
    return (
        <TouchableOpacity style={{...styles.container, backgroundColor: choose ? '#CB9DF0' : 'transparent'}} onPress={onPress}>
            <Text style={{...styles.text, color: choose ? 'white' : 'black'}}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    }
})

export default Chip;