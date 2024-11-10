import React, {useCallback} from 'react'
import {ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {router, useLocalSearchParams} from "expo-router";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";
import SongListItem from "@/components/SongListItem";
import {Image} from "expo-image";
import favicon from "@/assets/images/favicon.png";
import Feather from "@expo/vector-icons/Feather";
import FloatingPlayer from "@/components/FloatingPlayer";

const GenreScreen = () => {
    const inset = useSafeAreaInsets()
    const { index } = useLocalSearchParams<{ index: string }>()
    const { data: dataGenre } = useFetch<Genre>(BASE_URL + `genres/by_id?genre_id=${index}`)
    const { data: dataSongs, loading, error } = useFetch<Song[]>(BASE_URL + `songs/by_genre?genre_id=${index}`)

    const renderSongs = useCallback(() => {
        if (error) return <Text style={defaultStyle.error}>{error.message}</Text>
        if (loading) return <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"}/>
        if (!dataSongs) return <Text style={{flex: 1, textAlign: "center", ...defaultStyle.title}}>No songs found</Text>
        return (
            <FlatList
                data={dataSongs}
                keyExtractor={(item) => item.song_id.toString()}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                renderItem={({item}) => <SongListItem song={item}/>}
            />
        )
    }, [dataSongs, loading])

    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={30} color="black" />
                </Pressable>
                <Image
                    source={dataGenre ? { uri: dataGenre.image } : favicon }
                    priority={'high'}
                    contentFit={'cover'}
                    style={styles.image}
                />
                <Text numberOfLines={1} style={{...defaultStyle.header, flex: 1}}>{dataGenre?.name || "Unknown Title"}</Text>
            </View>
            <Text>{"\t\t" + dataGenre?.content || ""}</Text>
            {renderSongs()}
            <FloatingPlayer />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 5,
        width: '100%',
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 10,
    }
})

export default GenreScreen