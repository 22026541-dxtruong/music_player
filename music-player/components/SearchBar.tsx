import React, {useCallback, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import {defaultStyle} from "@/constants/styles";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import ArtistListItem from "@/components/ArtistListItem";
import AlbumListItem from "@/components/AlbumListItem";
import SongListItem from "@/components/SongListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from '@expo/vector-icons/Feather';

type Props = {
    type? : 'artist' | 'album' | 'song'
    visible: boolean
    onClose: () => void
}

const SearchBar = ({type, visible, onClose}: Props) => {
    const [query, setQuery] = useState('')
    const [history, setHistory] = useState<SearchResultItem[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)
    const [filterList, setFilterList] = useState<SearchResultItem[]>([])

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //         console.log('Back pressed - closing modal');
    //         if (visible) {
    //             onClose();
    //             return true;
    //         }
    //         return false;
    //     });
    //
    //     return () => backHandler.remove();
    // }, [visible, onClose]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoadingHistory(true)
                const searchHistory = await AsyncStorage.getItem('searchHistory')
                const parsedHistory = searchHistory ? JSON.parse(searchHistory) : [];
                if (Array.isArray(parsedHistory)) {
                    setHistory(parsedHistory);
                } else {
                    setHistory([]);
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoadingHistory(false)
            }
        }
        fetchHistory().catch(console.error)
    }, []);

    useEffect(() => {
        if (!type) return;
        setFilterList(history.filter(item => item.type === type))
    }, [type, history]);

    useEffect(() => {
        const saveToStorage = async () => {
            try {
                await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
            } catch (error) {
                console.error('Error saving search history:', error);
            }
        };
        if (history) saveToStorage().catch(console.error);
    }, [history]);

    const saveHistory = (item: SearchResultItem) => {
        setHistory(prev => [item, ...prev.filter(i => JSON.stringify(i) !== JSON.stringify(item))]);
    }

    const { data, loading } = useFetch<SearchResultItem[] | null>(BASE_URL + `search?query=${query}` + (type ? `&type=${type}` : ''))

    const renderItem = (item: SearchResultItem, onPress?: () => void) => {
        if (item.type === 'song') return <SongListItem song={item.data as Song} onPress={onPress} />
        if (item.type === 'album') return <AlbumListItem album={item.data as Album} onPress={onPress} />
        return <ArtistListItem artist={item.data as Artist} onPress={onPress} />
    }

    const keyFlatList = (item: SearchResultItem) => {
        if (item.type === 'song') return item.type + (item.data as Song).song_id.toString()
        if (item.type === 'album') return item.type + (item.data as Album).album_id.toString()
        return item.type + (item.data as Artist).artist_id.toString()
    }

    const renderResults = useCallback(() => {
        if (!query) return null;
        if (loading) return <ActivityIndicator size="large" color={'black'}/>
        if (!data)
            return <Text style={{marginVertical: 20, textAlign: "center",...defaultStyle.title}}>No artist, album and song</Text>
        return (
            <FlatList
                data={data}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                keyExtractor={item => keyFlatList(item)}
                renderItem={({item}) => renderItem(
                    item,
                    () => {
                        onClose()
                        saveHistory(item)
                    }
                )}
            />
        );
    }, [query, data, loading]);

    const renderHistory = useCallback(() => {
        if (loadingHistory) return <ActivityIndicator size="large" color={'black'}/>
        return (
            <FlatList
                data={type ? filterList : history}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                keyExtractor={item => keyFlatList(item)}
                renderItem={({item}) => renderItem(
                    item,
                    () => {
                        onClose()
                        saveHistory(item)
                    }
                )}
            />
        )
    }, [filterList, history, loadingHistory])

    return (
        <Modal animationType="fade" visible={visible} transparent={false}  onRequestClose={onClose}>
            <View style={defaultStyle.container}>
                <View style={styles.searchBarContainer}>
                    <Pressable onPress={onClose}>
                        <Feather name="arrow-left" size={30} color="black" />
                    </Pressable>
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        style={styles.searchBar}
                        placeholder={`Search ${type ? type : 'artist, albums and song'}`}
                    />
                </View>
                {query.length > 0 ? renderResults() : renderHistory()}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 5,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    searchBar: {
        fontSize: 16,
        flex: 1
    },
    headerFlatList: {
        ...defaultStyle.header,
        marginVertical: 10
    }
})

export default SearchBar;