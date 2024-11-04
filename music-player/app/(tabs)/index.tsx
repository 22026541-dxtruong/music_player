import React from 'react'
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import fakeData from "@/assets/data/fake.json";
import CircleArtist from "@/components/CircleArtist";
import {router} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';

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
                        <CircleArtist name={item.name} image={item.image}
                                      onPress={() => router.push(`/artists/${item.artist_id}`)}/>
                    }/>
                </View>
                <View>
                    <View style={styles.artist}>
                        <Text>Albums</Text>
                    </View>
                    <FlatList horizontal={true} keyExtractor={(item) => item.id.toString()}
                              showsHorizontalScrollIndicator={false} data={fakeData} renderItem={({item}) =>
                        <CircleArtist name={item.title} image={item.artwork}
                                      onPress={() => router.push(`/album/${item.id}`)}/>
                    }/>
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