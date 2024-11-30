import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from "react-native";
import {useDownloadContext} from "@/context/DownloadContext";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import Slider from "@react-native-community/slider";
import Feather from "@expo/vector-icons/Feather";
import {AntDesign} from "@expo/vector-icons";
import {defaultStyle} from "@/constants/styles";

const FloatingDownload = () => {
    const downloadContext = useDownloadContext()

    const [sliderValue, setSliderValue] = useState(downloadContext.downloadProgress);

    useEffect(() => {
        setSliderValue(downloadContext.downloadProgress)
    }, [downloadContext.downloadProgress]);

    if (!downloadContext.isDownloading) return null

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerItem}>
                    <Image
                        style={styles.image}
                        contentFit={"cover"}
                        source={downloadContext.downloadSong ? {uri: downloadContext.downloadSong.image} : favicon}
                        priority="normal"
                    />
                    <Text numberOfLines={1} style={defaultStyle.title}>{downloadContext.downloadSong?.title}</Text>
                </View>
                <Pressable onPress={downloadContext.cancelDownload}>
                    <AntDesign name="delete" size={24} color="red" />
                </Pressable>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={sliderValue}
                minimumTrackTintColor="#8B5DFF"
                maximumTrackTintColor="#000000"
                thumbTintColor={'transparent'}
            />
            <Text>{'Đang tải xuống:'} {Math.round(sliderValue * 100)}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {

    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    slider: {
        width: '100%',
        margin: 0,
        padding: 0
    }
})

export default FloatingDownload;