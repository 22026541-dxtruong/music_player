import React, {useEffect, useState} from 'react';
import { useAudioContext } from "@/context/AudioContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { defaultStyle } from "@/constants/styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {router} from "expo-router";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import Slider from "@react-native-community/slider";

const FloatingPlayer = () => {
    const audioContext = useAudioContext();
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${audioContext.currentSong?.artist_id}`)

    const [sliderValue, setSliderValue] = useState(0)

    useEffect(() => {
        const interval = setInterval(async () => {
            if (audioContext.currentSong) {
                if (audioContext.currentSong?.duration) {
                    const position = await audioContext.getCurrentPosition();
                    setSliderValue(position);
                } else {
                    setSliderValue(0)
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [audioContext]);

    const handleSliderChange = async (newPosition: number) => {
        if (!audioContext.loading) {
            setSliderValue(newPosition);
            await audioContext.setPosition(newPosition);
        }
    };

    if (!audioContext.currentSong) return null;

    return (
        <View style={styles.container}>
            <Pressable style={styles.controller} onPress={() =>router.navigate(`/songs/${audioContext.currentSong?.song_id}`)} >
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
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={!audioContext.loading ? audioContext.currentSong?.duration : 1}
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#8B5DFF"
                maximumTrackTintColor="#000000"
                thumbTintColor={'transparent'}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    controller: {
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
        width: '110%',
        margin: 0,
        padding: 0
    },
});

export default FloatingPlayer;
