import React, {useMemo} from 'react'
import {FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import {Redirect, router} from "expo-router";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';
import CircleArtist from "@/components/CircleArtist";
import {Image} from "expo-image";
import logotext from "@/assets/images/logotext.png";
import RoundedSquareSong from "@/components/RoundedSquareSong";
import FloatingDownload from "@/components/FloatingDownload";
import {useAuthContext} from "@/context/AuthContext";
import {generateUserColor} from "@/utils/generateColor";
import {DrawerToggleButton} from "@react-navigation/drawer";
import CircleAvatar from "@/components/CircleAvatar";

const HomeScreen = () => {
    const { user } = useAuthContext()

    if (!user) {
        return <Redirect href={'/login'} />
    }

    const { data: dataArtist, loading: loadingArtist, error } = useFetch<Artist[]>(BASE_URL + 'artists')
    const { data: dataSongs, loading } = useFetch<Song[]>(BASE_URL + 'songs')

    return (
        <View style={defaultStyle.container}>
            <View style={styles.header}>
                <Image source={logotext} style={styles.image} contentFit={"contain"} />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <DrawerToggleButton tintColor={'transparent'}/>
                    <CircleAvatar size={40} style={{ position: "absolute", zIndex: -1}}/>
                </View>
            </View>
            <FloatingDownload />
            <View style={{flex: 1}}>
                <Text style={{...defaultStyle.title, paddingBottom: 10}}>Hot Recommend</Text>
                <FlatList
                    data={dataSongs}
                    keyExtractor={(item) => item.song_id.toString()}
                    horizontal={true}
                    ItemSeparatorComponent={() => <View style={{width: 10}} />}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) =>
                        <RoundedSquareSong song={item} />
                    }
                />
                <Text style={{...defaultStyle.title, paddingBottom: 10}}>Made for you</Text>
                <View style={styles.artistContainer}>
                    <View style={styles.artist}>
                        <Text>Artists</Text>
                        <Pressable onPress={() => router.push("/artists")}><Text>See all</Text></Pressable>
                    </View>
                    <FlatList horizontal={true} keyExtractor={(item) => item.artist_id.toString()}
                              showsHorizontalScrollIndicator={false} data={dataArtist} renderItem={({item}) =>
                        <CircleArtist artist={item}/>
                    }/>
                </View>
                <View>
                    <View style={styles.artist}>
                        <Text>Albums</Text>
                    </View>

                </View>
            </View>
            <FloatingPlayer/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        width: 200,
        height: 50,
    },
    artistContainer: {},
    artist: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
})

export default HomeScreen