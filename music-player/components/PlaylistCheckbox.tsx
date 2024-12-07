import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import playlistLogo from "@/assets/images/playlist-logo.jpg";
import {defaultStyle} from "@/constants/styles";
import {Checkbox} from "expo-checkbox";

type Props = {
    playlist: Playlist,
    isChecked: boolean,
    onCheckChange: (playlistId: number, checked: boolean) => void
}

const PlaylistCheckbox = ({playlist, isChecked, onCheckChange}: Props) => {

    return (
        <View style={styles.container}>
            <View style={styles.imageAndName}>
                <Image
                    source={playlistLogo}
                    priority={"normal"}
                    style={styles.image}
                />
                <Text style={defaultStyle.title}>{playlist.name}</Text>
            </View>
            <Checkbox value={isChecked} onValueChange={(checked) => onCheckChange(playlist.playlist_id, checked)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: '100%'
    },
    imageAndName: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 15,
    }
})

export default PlaylistCheckbox;