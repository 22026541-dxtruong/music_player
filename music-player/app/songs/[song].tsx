import React, {useEffect, useState} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {router} from "expo-router";
import {useAudioContext} from "@/context/AudioContext";
import {Image} from "expo-image";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import {formatTime} from "@/utils/formatTime";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";

const SongScreen = () => {
    const audioContext = useAudioContext()
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${audioContext.currentSong?.artist_id}`)
    const inset = useSafeAreaInsets()
    const [sliderValue, setSliderValue] = useState(0);
    const [isRepeating, setIsRepeating] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (audioContext.currentSong) {
                const position = await audioContext.getCurrentPosition();
                setSliderValue(position);
            }
        }, 0);

        return () => clearInterval(interval);
    }, [audioContext]);

    const handleSliderChange = async (newPosition: number) => {
        setSliderValue(newPosition);
        await audioContext.setPosition(newPosition);
    };

    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            <View style={styles.topAppBar}>
                <Pressable style={styles.buttonAppBar} onPress={() => router.back()}>
                    <FontAwesome6 name="chevron-left" size={20} color="black"/>
                </Pressable>
                <Text numberOfLines={1} style={defaultStyle.header}>
                    {audioContext.currentSong?.title}
                </Text>
                <Pressable style={styles.buttonAppBar}>
                    <FontAwesome6 name="ellipsis-vertical" size={20} color="black"/>
                </Pressable>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: audioContext.currentSong?.image}}
                        priority="normal"
                        style={{...styles.image}}
                        contentFit='cover'
                    />
                </View>
                <View style={styles.infoAndFavorite}>
                    <View style={styles.songAndArtist}>
                        <Text numberOfLines={1} style={defaultStyle.title}>
                            {audioContext.currentSong?.title}
                        </Text>
                        <Text numberOfLines={1} style={defaultStyle.subtitle}>
                            {dataArtist?.name}
                        </Text>
                    </View>
                    <Pressable>
                        <FontAwesome6 name="heart" size={20} color="black"/>
                    </Pressable>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={audioContext.currentSong?.duration}
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
                <View style={styles.time}>
                    <Text>{formatTime(sliderValue)}</Text>
                    <Text>{formatTime(audioContext.currentSong?.duration)}</Text>
                </View>
                <View style={styles.controller}>
                    <Pressable>
                        <FontAwesome6 name="shuffle" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={audioContext.playPrevious}>
                        <FontAwesome6 name="backward" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={audioContext.isPlaying ? audioContext.pause : audioContext.resume}>
                        {audioContext.isPlaying ? (
                            <FontAwesome6 name="pause" size={24} color="black" />
                        ) : (
                            <FontAwesome6 name="play" size={24} color="black" />
                        )}
                    </Pressable>
                    <Pressable onPress={audioContext.playNext}>
                        <FontAwesome6 name="forward" size={20} color="black"/>
                    </Pressable>
                    <Pressable onPress={() => {
                            setIsRepeating(!isRepeating);
                            audioContext.toggleRepeat(!isRepeating);
                        }} style={isRepeating ? styles.buttonAppBar : {}}>
                        <FontAwesome6 name="repeat" size={20} color="black"/>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topAppBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonAppBar: {
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        borderRadius: 10,
        width: 40,
        height: 40
    },
    contentContainer: {
        padding: 10,
        flex: 1,
        gap: 20
    },
    imageContainer: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.44,
        shadowRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: "center",
        height: '50%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        borderRadius: 12
    },
    infoAndFavorite: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    songAndArtist: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 5,
    },
    slider: {
        width: '100%'
    },
    time: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    controller: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    }
})

export default SongScreen