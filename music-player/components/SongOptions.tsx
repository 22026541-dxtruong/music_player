import React from 'react';
import {Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, Share} from "react-native";
import {defaultStyle} from "@/constants/styles";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import {Ionicons} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {router} from "expo-router";
import {useAuthContext} from "@/context/AuthContext";

type Props = {
    visible: boolean,
    onClose: () => void,
    song: Song | null,
    artist?: Artist,
    addPlaylist: () => void
}
const SongOptions = ({visible, onClose, song, artist, addPlaylist}: Props) => {

    const {user} = useAuthContext()
    const handlePressOutside = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const shareSong = async () => {
        if (!song || !artist) {
            return
        }
        try {
            const result = await Share.share({
                title: song.title,
                message: `🎶 ${song.title} - ${artist.name} 🎶\n` +
                `Được gửi từ ${user?.username}, hy vọng bạn sẽ thích bài hát này! 🎧\n` +
                `Tìm nghe bài hát đầy đủ tại: ${song.file_path}`,
            })
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Share with activity type: ', result.activityType)
                } else {
                    console.log('shared')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal animationType={'fade'} visible={visible} transparent={true} onRequestClose={onClose}>
            <Pressable style={styles.container} onPress={handlePressOutside}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image
                            source={song ? {uri: song.image} : favicon}
                            priority="normal"
                            style={styles.image}
                        />
                        <View>
                            <Text style={defaultStyle.title}>{song?.title}</Text>
                            <Text style={defaultStyle.subtitle}>{artist?.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.option} onPress={() => {
                        addPlaylist()
                        onClose()
                    }}>
                        <Ionicons name="add-circle-outline" size={30} color="black" />
                        <Text style={defaultStyle.title}>Add to playlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => {
                        router.push(`/artists/${artist?.artist_id}`)
                        onClose()
                    }}>
                        <MaterialIcons name="person" size={30} color="black" />
                        <Text style={defaultStyle.title}>Go to artist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => {
                        shareSong().catch(console.error)
                        onClose()
                    }}>
                        <MaterialIcons name="share" size={30} color="black" />
                        <Text style={defaultStyle.title}>Share</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...defaultStyle.container,
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'white',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        height: 240,
        width: '100%',
        padding: 15
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10
    },
    option: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 10,
        width: '100%',
        paddingVertical: 10
    }
})

export default SongOptions;