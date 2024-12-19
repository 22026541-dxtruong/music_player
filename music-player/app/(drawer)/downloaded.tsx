import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Pressable, View} from "react-native";
import {defaultStyle} from "@/constants/styles";
import FloatingPlayer from "@/components/FloatingPlayer";
import {useSQLiteContext} from "expo-sqlite";
import SongListItem from "@/components/SongListItem";
import {useDownloadContext} from "@/context/DownloadContext";
import {AntDesign} from "@expo/vector-icons";
import {useFocusEffect} from "expo-router";
import {useAuthContext} from "@/context/AuthContext";

const DownloadedSongScreen = () => {
    const database = useSQLiteContext()
    const { user } = useAuthContext()
    const { deleteFile } = useDownloadContext()
    const [data, setData] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const fetchData = async() => {
        setLoading(true);
        if (!user) return;
        console.log(user)
        try {
            const songs: Song[] = await database.getAllAsync(`
                SELECT 
                    s.song_id,
                    s.title,
                    s.album_id,
                    s.artist_id,
                    s.image,
                    s.file_path
                FROM songs s 
                JOIN user_download_song udl
                ON s.song_id = udl.song_id
                WHERE udl.user_id = ${user.user_id}
            `)
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
        if (user) deleteFile(song, user.user_id).catch(console.error);
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