import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from "react-native";
import {ImageBackground} from "expo-image";
import favicon from "@/assets/images/favicon.png"
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";
import {defaultStyle} from "@/constants/styles";
import {useAudioContext} from "@/context/AudioContext";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";

type Props = {
    song: Song
}

const RoundedSquareSong = ({song}: Props) => {
    const audioContext = useAudioContext()
    const { data: dataArtist } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${song.artist_id}`)

    const playSong = () => {
        audioContext.play(song).catch(console.error)
        router.push(`/songs/${audioContext.currentSong?.song_id}`)
        if (audioContext.album !== undefined && !audioContext.songList.map(item => item.song_id).includes(song.song_id)) {
            audioContext.handlePlaySongList().catch(console.error)
            audioContext.setAlbum(undefined)
        }
    }

    return (
        <Pressable onPress={() => {
            playSong()
        }}>
            <ImageBackground
                source={song.image ? {uri: song.image} : favicon}
                style={styles.container}
            >
                <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.backgroundImage}/>
                <View style={styles.songAndArtist}>
                    <Text style={{...defaultStyle.title, color: 'white'}}>{song.title}</Text>
                    <Text style={{...defaultStyle.subtitle}}>{dataArtist?.name || ''}</Text>
                </View>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 150,
        borderRadius: 10,
        overflow: "hidden"
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: "absolute",
        top: 0,
        left: 0,
    },
    songAndArtist: {
        position: "absolute",
        bottom: 10,
        left: 10
    }
})

export default memo(RoundedSquareSong);