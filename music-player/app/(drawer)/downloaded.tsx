import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Pressable, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import FloatingPlayer from "@/components/FloatingPlayer";
import {useSQLiteContext} from "expo-sqlite";
import SongListItem from "@/components/SongListItem";
import {useDownloadContext} from "@/context/DownloadContext";
import {AntDesign} from "@expo/vector-icons";
import {useFocusEffect} from "expo-router";

const DownloadedSongScreen = () => {
    const database = useSQLiteContext()
    const { deleteFile } = useDownloadContext()
    const [data, setData] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const fetchData = async() => {
        setLoading(true);
        try {
            const songs: Song[] = await database.getAllAsync(`SELECT * FROM songs`)
            setData(songs)
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false);
        }
    }
    useFocusEffect(
        useCallback(() => {
            fetchData().catch(console.error);
        }, [])
    );
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    const handleDelete = (song: Song) => {
        deleteFile(song).catch(console.error);
        setData(prevData => prevData.filter(item => item.song_id !== song.song_id));
    }

    return (
        <View style={defaultStyle.container}>
            {loading ? (
                <ActivityIndicator style={{flex: 1}} size={"large"} color={"blue"} />
            ) : (
                <FlatList
                    data={data}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    keyExtractor={(item) => item.song_id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                    renderItem={({item}) =>
                        <View style={{flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'}}>
                            <SongListItem song={item}/>
                            <Pressable onPress={() => handleDelete(item)}>
                                <AntDesign name="delete" size={24} color="red" />
                            </Pressable>
                        </View>
                    }
                />
            )}
            <FloatingPlayer />
        </View>
    );
};

export default DownloadedSongScreen;