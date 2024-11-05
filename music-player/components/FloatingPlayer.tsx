import React from 'react';
import { useAudioContext } from "@/context/AudioContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { defaultStyle } from "@/constants/styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {router} from "expo-router";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";

const FloatingPlayer = () => {
    const audioContext = useAudioContext();
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${audioContext.currentSong?.artist_id}`)

    if (!audioContext.currentSong) return null;

    return (
        <View>
            <Pressable style={styles.container} onPress={() =>router.navigate(`/songs/${audioContext.currentSong?.song_id}`)} >
                <View style={styles.left}>
                    <Image
                        source={{ uri: audioContext.currentSong.image }}
                        priority="normal"
                        style={styles.image}
                    />
                    <View style={styles.songAndArtist}>
                        <Text lineBreakMode={'head'} numberOfLines={1} style={defaultStyle.title}>
                            {audioContext.currentSong.title}
                        </Text>
                        <Text numberOfLines={1} style={defaultStyle.subtitle}>
                            {dataArtist?.name || ''}
                        </Text>
                    </View>
                </View>
                <View>
                    <Pressable onPress={audioContext.isPlaying ? audioContext.pause : audioContext.resume}>
                        {audioContext.isPlaying ? (
                            <FontAwesome6 name="pause" size={24} color="black" />
                        ) : (
                            <FontAwesome6 name="play" size={24} color="black" />
                        )}
                    </Pressable>
                </View>
            </Pressable>
            {/*<Slider*/}
            {/*    style={styles.slider}*/}
            {/*    minimumValue={0}*/}
            {/*    maximumValue={audioContext.currentSong?.duration}*/}
            {/*    value={sliderValue}*/}
            {/*    disabled={true}*/}
            {/*    minimumTrackTintColor="#FFFFFF"*/}
            {/*    maximumTrackTintColor="#000000"*/}
            {/*    thumbTintColor="transparent"*/}
            {/*/>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        flex: 1
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
        flex: 1
    },
    slider: {
        width: '100%',
        margin: 0,
        padding: 0
    },
});

export default FloatingPlayer;
