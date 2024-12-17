import {useAuthContext} from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import {BASE_URL} from "@/constants/constants";
import React, {useCallback, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Pressable, View} from "react-native";
import axios from "axios";
import {AntDesign} from "@expo/vector-icons";
import {defaultStyle} from "@/constants/styles";
import SongListItem from "@/components/SongListItem";
import FloatingPlayer from "@/components/FloatingPlayer";
import {useFocusEffect} from "expo-router";

const HistoryScreen = () => {
    const { user } = useAuthContext()
    const [refreshing, setRefreshing] = useState(false);
    const { data, loading, error, reFetchData } = useFetch<Song[]>(BASE_URL + `songs/history?user_id=${user?.user_id}`)

    useFocusEffect(
        useCallback(() => {
            reFetchData();
        }, [])
    )

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await reFetchData();
        setRefreshing(false);
    };

    const handleDelete = async (item: Song) => {
        try {
            await axios.delete(BASE_URL + `songs/history/delete?user_id=${user?.user_id}&song_id=${item.song_id}`);
            reFetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    return (
        <View style={defaultStyle.container}>
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.song_id.toString()}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({item}) =>
                        <View style={{flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
                            <SongListItem song={item}/>
                            <Pressable onPress={() => handleDelete(item)}>
                                <AntDesign name="delete" size={24} color="red" />
                            </Pressable>
                        </View>
                    }
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                />
            )}
            <FloatingPlayer />
        </View>
    );
};

export default HistoryScreen;