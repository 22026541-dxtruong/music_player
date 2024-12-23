import React, {useState} from 'react'
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import {Redirect, router} from "expo-router";
import useFetch from "@/hooks/useFetch";
import { BASE_URL } from '@/constants/constants';
import CircleArtist from "@/components/CircleArtist";
import {Image} from "expo-image";
import logotext from "@/assets/images/logotext.png";
import RoundedSquareSong from "@/components/RoundedSquareSong";
import FloatingDownload from "@/components/FloatingDownload";
import {useAuthContext} from "@/context/AuthContext";
import {DrawerToggleButton} from "@react-navigation/drawer";
import CircleAvatar from "@/components/CircleAvatar";
import SquareAlbum from "@/components/SquareAlbum";
import SongListItem from "@/components/SongListItem";
import {RefreshControl} from "react-native-gesture-handler";

const HomeScreen = () => {
    const { user } = useAuthContext()

    if (!user) {
        return <Redirect href={'/login'} />
    }

    const { data: hotSongs, loading: loadingHotSongs, reFetchData: reFetchHotSongs } = useFetch<Song[]>(BASE_URL + 'hotsongs')
    const { data: suggestSongs, loading: loadingSuggestSongs, reFetchData: reFetchSuggestSongs } = useFetch<Song[]>(BASE_URL + `suggest/songs?user_id=${user?.user_id}`)
    const { data: suggestArtists, loading: loadingSuggestArtists, reFetchData: reFetchSuggestArtists } = useFetch<Artist[]>(BASE_URL + `suggest/artists?user_id=${user?.user_id}`)
    const { data: suggestAlbums, loading: loadingSuggestAlbums, reFetchData: reFetchSuggestAlbums } = useFetch<Album[]>(BASE_URL + `suggest/albums?user_id=${user?.user_id}`)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            reFetchHotSongs(),
            reFetchSuggestSongs(),
            reFetchSuggestArtists(),
            reFetchSuggestAlbums(),
        ]);
        setRefreshing(false);
    };

    return (
        <View style={defaultStyle.container}>
            <View style={styles.header}>
                <Image source={logotext} style={styles.image} contentFit={"contain"} />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <DrawerToggleButton tintColor={'transparent'}/>
                    <CircleAvatar size={40} style={{ position: "absolute", zIndex: -1}}/>
                </View>
            </View>
            <FloatingDownload />
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        colors={['blue']}
                    />
                }
            >
                <Text style={{...defaultStyle.title, paddingBottom: 10}}>Hot Recommend</Text>
                {loadingHotSongs ?
                    <ActivityIndicator size={'large'} color={'blue'} /> :
                    <FlatList
                        data={hotSongs}
                        keyExtractor={(item) => item.song_id.toString()}
                        horizontal={true}
                        ItemSeparatorComponent={() => <View style={{width: 10}} />}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) =>
                            <RoundedSquareSong song={item} />
                        }
                    />
                }
                <Text style={{...defaultStyle.title, paddingVertical: 10}}>Made for you</Text>
                {!suggestSongs && !suggestArtists && !suggestAlbums && <Text style={{...defaultStyle.title, paddingVertical: 10, textAlign:'center', textAlignVertical: 'center'}}>Hãy khám phá các bài hát yêu thích của bạn!</Text>}
                {(suggestArtists && suggestArtists.length >= 0) && <View style={styles.artistContainer}>
                    <View style={styles.artist}>
                        <Text style={defaultStyle.title}>Artists</Text>
                        <Pressable onPress={() => router.push("/artists")}><Text style={styles.text}>See all</Text></Pressable>
                    </View>
                    {loadingSuggestArtists ?
                        <ActivityIndicator size={"large"} color={"blue"} /> :
                        <FlatList
                            horizontal={true}
                            keyExtractor={(item) => item.artist_id.toString()}
                            showsHorizontalScrollIndicator={false}
                            data={suggestArtists}
                            ItemSeparatorComponent={() => <View style={{width: 10}} />}
                            renderItem={({item}) =>
                                <CircleArtist artist={item}/>
                            }
                        />
                    }
                </View>}
                {(suggestAlbums && suggestAlbums.length >= 0) && <View style={styles.artistContainer}>
                    <View style={styles.artist}>
                        <Text style={defaultStyle.title}>Albums</Text>
                        <Pressable onPress={() => router.push("/albums")}><Text style={styles.text}>See all</Text></Pressable>
                    </View>
                    {loadingSuggestAlbums ?
                        <ActivityIndicator size={'large'} color={'blue'} /> :
                        <FlatList
                            horizontal={true}
                            keyExtractor={(item) => item.album_id.toString()}
                            showsHorizontalScrollIndicator={false}
                            data={suggestAlbums}
                            ItemSeparatorComponent={() => <View style={{width: 10}} />}
                            renderItem={({item}) =>
                                <SquareAlbum album={item}/>
                            }
                        />
                    }
                </View>}
                {(suggestSongs && suggestSongs.length >= 0) && <>
                    <Text style={{...defaultStyle.title, paddingBottom: 10}}>Songs</Text>
                    {loadingSuggestSongs ?
                        <ActivityIndicator size={'large'} color={'blue'} /> :
                        <FlatList
                            data={suggestSongs}
                            keyExtractor={(item) => item.song_id.toString()}
                            ItemSeparatorComponent={() => <View style={{height: 10}} />}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={({item}) =>
                                <SongListItem song={item} />
                            }
                        />
                    }
                </>}
            </ScrollView>
            <FloatingPlayer/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },
    image: {
        width: 200,
        height: 50,
    },
    artistContainer: {
        paddingBottom: 10
    },
    artist: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10
    },
    text: {
        backgroundColor: '#eef5ff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20
    }
})

export default HomeScreen