import React, {useMemo, useState} from 'react'
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import ArtistListItem from "@/components/ArtistListItem";
import AlbumListItem from "@/components/AlbumListItem";
import SongListItem from "@/components/SongListItem";

const SearchScreen = () => {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false);

    const { data: resultArtist, loading: loadingArtist } = useFetch<Artist[]>(BASE_URL + `search/artists?query=${query}`)
    const { data: resultAlbum, loading: loadingAlbum } = useFetch<Album[]>(BASE_URL + `search/albums?query=${query}`)
    const { data: resultSong, loading: loadingSong } = useFetch<Song[]>(BASE_URL + `search/songs?query=${query}`)

    const renderResults = useMemo(() => {
        if (!query) return null;
        if (loadingArtist && loadingAlbum && loadingSong) return <ActivityIndicator size="large" color={'black'}/>
        return (
            <>
                {resultArtist && resultArtist.length > 0 && <FlatList
                    scrollEnabled={false}
                    data={resultArtist}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    keyExtractor={item => item.artist_id.toString() + item.name + item.image}
                    ListHeaderComponent={<Text style={styles.headerFlatList}>Artist</Text>}
                    renderItem={({item}) => <ArtistListItem artist={item}/>}/>
                }
                {resultAlbum && resultAlbum.length > 0 && <FlatList
                    data={resultAlbum}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    keyExtractor={item => item.album_id.toString() + item.title}
                    ListHeaderComponent={<Text style={styles.headerFlatList}>Album</Text>}
                    renderItem={({item}) => <AlbumListItem album={item}/>}/>}
                {resultSong && resultSong.length > 0 && <FlatList
                    data={resultSong}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    keyExtractor={item => item.song_id.toString() + item.title + item.artist_id.toString() }
                    ListHeaderComponent={<Text style={styles.headerFlatList}>Song</Text>}
                    renderItem={({item}) => <SongListItem song={item}/>}/>}
            </>
        );
    }, [query, resultArtist, resultAlbum, resultSong, loadingArtist, loadingAlbum, loadingSong]);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={defaultStyle.container}>
                <TextInput
                    style={styles.searchBar}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search artist, album and song"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <ScrollView style={{flex: 1}}>
                    {renderResults}
                </ScrollView>
                <FloatingPlayer />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    searchBar: {

    },
    headerFlatList: {
        ...defaultStyle.header,
        marginVertical: 10
    }
})

export default SearchScreen