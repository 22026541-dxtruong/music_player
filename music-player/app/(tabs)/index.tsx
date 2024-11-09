import React from 'react'
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';
import CircleArtist from "@/components/CircleArtist";

const HomeScreen = () => {
    const inset = useSafeAreaInsets()
    const { data, loading, error } = useFetch<Artist[]>(BASE_URL + 'artists')
    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            <View style={{flex: 1}}>
                <View style={styles.artistContainer}>
                    <View style={styles.artist}>
                        <Text>Artists</Text>
                        <Pressable onPress={() => router.push("/artists")}><Text>See all</Text></Pressable>
                    </View>
                    <FlatList horizontal={true} keyExtractor={(item) => item.artist_id.toString()}
                              showsHorizontalScrollIndicator={false} data={data} renderItem={({item}) =>
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
    artistContainer: {},
    artist: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

export default HomeScreen