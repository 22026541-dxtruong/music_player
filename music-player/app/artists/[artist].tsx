import React, {useEffect, useRef, useState} from 'react'
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native'
import {defaultStyle} from "@/constants/styles";
import {useLocalSearchParams, useNavigation} from "expo-router";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import PagerView from "react-native-pager-view";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SongListItem from "@/components/SongListItem";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';
import AlbumListItem from "@/components/AlbumListItem";

const ArtistScreen = () => {
    const {artist} = useLocalSearchParams<{ artist: string }>()
    const { data: dataArtists } = useFetch<Artist>(BASE_URL + `artists/by_id?artist_id=${artist}`)
    const { data: dataSongs } = useFetch<Song[]>(BASE_URL + `songs/by_artist?artist_id=${artist}`)
    const { data: dataAlbums } = useFetch<Album[]>(BASE_URL + `albums/by_artist?artist_id=${artist}`)
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef<PagerView>(null);
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            title: dataArtists?.name || "Artist",
        })
    }, [dataArtists])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        pagerRef.current?.setPage(page);
    };

    return (
        <View style={{...defaultStyle.container}}>
            <View style={styles.header}>
                <Image style={styles.image}
                       source={{uri: dataArtists?.image}}
                       priority="normal" contentFit={"cover"}/>
                <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.backgroundImage}/>
                <Text style={styles.artistName} numberOfLines={1}>{dataArtists?.name || "Unknown Title"}</Text>
            </View>
            <View style={styles.option}>
                <Pressable style={styles.addArtist}>
                    <Ionicons name="person-add-outline" size={24} color="black"/>
                    <Text>Add Artist</Text>
                </Pressable>
                <View style={styles.activeOption}>
                    <Pressable>
                        <FontAwesome6 name="shuffle" size={20} color="black"/>
                    </Pressable>
                    <Pressable>
                        <FontAwesome6 name="play" size={24} color="black"/>
                    </Pressable>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => handlePageChange(0)}>
                    <Text style={currentPage === 0 ? styles.activeButton : styles.button}>Songs</Text>
                </Pressable>
                <Pressable onPress={() => handlePageChange(1)}>
                    <Text style={currentPage === 1 ? styles.activeButton : styles.button}>Albums</Text>
                </Pressable>
            </View>
            <PagerView
                style={styles.pager}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1" style={styles.page}>
                    {dataSongs ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.song_id.toString()}
                            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                            data={dataSongs}
                            renderItem={({item}) => <SongListItem song={item} artist={dataArtists}/>}/>
                    ) : <Text>No songs found</Text>}
                </View>
                <View key="2" style={styles.page}>
                    {dataAlbums ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.album_id.toString()}
                            ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                            data={dataAlbums}
                            renderItem={({item}) => <AlbumListItem album={item}/>}/>
                    ) : <Text>No songs found</Text>}
                </View>
            </PagerView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 250,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: "absolute",
        top: 0,
        left: 0
    },
    artistName: {
        ...defaultStyle.header,
        width: '100%',
        color: 'white',
        position: "absolute",
        bottom: 10,
        left: 10
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    addArtist: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
        borderWidth: 1,
        padding: 5
    },
    activeOption: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        padding: 5
    },
    pager: {
        flex: 1
    },
    page: {
        justifyContent: 'center',
    },
    button: {
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    activeButton: {
        color: 'blue',
        fontWeight: 'bold',
    },
})

export default ArtistScreen