import React, {useCallback, useState} from 'react'
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import SearchBar from "@/components/SearchBar";
import {Ionicons} from "@expo/vector-icons";
import {BASE_URL} from "@/constants/constants";
import useFetch from "@/hooks/useFetch";
import GenreListItem from "@/components/GenreListItem";
import {router} from "expo-router";
import CircleArtist from "@/components/CircleArtist";
import SquareAlbum from "@/components/SquareAlbum";
import FloatingDownload from "@/components/FloatingDownload";

const SearchScreen = () => {
    const [showSearchBar, setShowSearchBar] = useState(false)
    const toggleSearchBar = () => setShowSearchBar(!showSearchBar);
    const {data: dataGenre, loading: loadingGenre, error: errorGenre} = useFetch<Genre[]>(BASE_URL + 'genres');
    const {data: dataArtist, loading: loadingArtist, error: errorArtist} = useFetch<Artist[]>(BASE_URL + 'artists')
    const {data: dataAlbum, loading: loadingAlbum, error: errorAlbum} = useFetch<Album[]>(BASE_URL + 'albums')

    const renderGenres = useCallback(() => {
        if (errorGenre) return <Text style={defaultStyle.error}>Genres: {errorGenre.message}</Text>
        if (loadingGenre) return <ActivityIndicator size={"large"} color={"blue"}/>
        return (
            <FlatList
                data={dataGenre}
                scrollEnabled={false}
                keyExtractor={(item) => item.genre_id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item}) => <GenreListItem genre={item}/>}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
            />
        )
    }, [dataGenre, loadingGenre])

    const renderArtists = useCallback(() => {
        if (errorArtist) return <Text
            style={defaultStyle.error}>Artists: {errorArtist.message}</Text>
        if (loadingArtist) return <ActivityIndicator size={"large"} color={"blue"}/>
        return (
            <FlatList
                data={dataArtist}
                keyExtractor={(item) => item.artist_id.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({item}) =>
                    <CircleArtist artist={item}/>
                }
                ItemSeparatorComponent={() => <View style={{width: 10}}/>}
            />
        )
    }, [dataArtist, loadingArtist])

    const renderAlbums = useCallback(() => {
        if (errorAlbum) return <Text style={defaultStyle.error}>Albums: {errorAlbum.message}</Text>
        if (loadingAlbum) return <ActivityIndicator size={"large"} color={"blue"}/>
        return (
            <FlatList
                data={dataAlbum}
                keyExtractor={(item) => item.album_id.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({item}) =>
                    <SquareAlbum album={item}/>
                }
                ItemSeparatorComponent={() => <View style={{width: 10}}/>}
            />
        )
    }, [dataAlbum, loadingAlbum])

    return (
        <View style={defaultStyle.container}>
            <TouchableOpacity onPress={toggleSearchBar}>
                <View style={styles.searchBar}>
                    <Ionicons
                        name="search-sharp"
                        size={24}
                        color={'black'}
                    />
                    <Text>Search artist, album and song</Text>
                </View>
            </TouchableOpacity>
            <FloatingDownload />
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <View style={styles.headerList}>
                    <Text style={defaultStyle.header}>Artists</Text>
                    <Pressable onPress={() => router.push("/artists")}>
                        <Text style={styles.text}>View all</Text>
                    </Pressable>
                </View>
                {renderArtists()}
                <Text style={{...defaultStyle.header, paddingBottom: 5}}>Albums</Text>
                {renderAlbums()}
                <Text style={{...defaultStyle.header, paddingBottom: 5}}>Genres</Text>
                {renderGenres()}
            </ScrollView>
            <SearchBar visible={showSearchBar} onClose={toggleSearchBar}/>
            <FloatingPlayer/>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 5,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
    headerList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 5
    },
    text: {
        backgroundColor: '#eef5ff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20
    }
})

export default SearchScreen