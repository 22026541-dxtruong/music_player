import React, {useState} from 'react';
import {ActivityIndicator, Alert, Animated, FlatList, Pressable, StyleSheet, View} from "react-native";
import { defaultStyle } from "@/constants/styles";
import FloatingPlayer from "@/components/FloatingPlayer";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';
import {useAuthContext} from "@/context/AuthContext";
import {Swipeable} from "react-native-gesture-handler";
import colors from "@/constants/colors";
import {AntDesign} from "@expo/vector-icons";
import SongListItem from "@/components/SongListItem";
import axios from "axios";
import AddFavorite from "@/components/AddFavorite";
import SearchBar from "@/components/SearchBar";

const SongListScreen = () => {
    const { user } = useAuthContext()
    const { data, loading, error, reFetchData } = useFetch<Song[]>(BASE_URL + `favorites/songs?user_id=${user?.user_id}`)

    const [isSearching, setIsSearching] = useState(false)

    const handleAdd = () => {
        setIsSearching(!isSearching)
    }

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    const handleDelete = async (item: Song) => {
        try {
            await axios.delete(BASE_URL + `songs/history/delete?user_id=${user?.user_id}&song_id=${item.song_id}`);
            reFetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    const renderRightActions = (
        progress:  Animated.AnimatedInterpolation<string | number>,
        dragX: Animated.AnimatedInterpolation<string | number>,
        item: Song
    ) => {
        return (
            <View style={styles.rightAction}>
                <Pressable onPress={() => handleDelete(item)}>
                    <AntDesign name="delete" size={24} color="white" />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={defaultStyle.container}>
            <AddFavorite text={'Add Song'} icon={'queue-music'} onPress={handleAdd} />
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.song_id.toString()}
                    scrollEnabled={false}
                    renderItem={({item}) =>
                        <Swipeable
                            childrenContainerStyle={{backgroundColor: colors.background}}
                            renderRightActions={(progress, dragX) =>
                                renderRightActions(progress, dragX, item)
                            }
                            overshootLeft={false}
                        >
                            <SongListItem song={item}/>
                        </Swipeable>
                    }
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                />
            )}
            <SearchBar type={'song'} visible={isSearching} onClose={() => handleAdd()} />
            <FloatingPlayer />
        </View>
    );
};

const styles = StyleSheet.create({
    rightAction: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 50,
        height: '100%',
    },
})

export default SongListScreen;