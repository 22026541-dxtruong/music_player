import React from 'react';
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

const SongListScreen = () => {
    const { user } = useAuthContext()
    const { data, loading, error } = useFetch<FavoriteSong[]>(BASE_URL + `favorites/songs?user_id=${user?.user_id}`)

    if (error) {
        Alert.alert("Error", error.message);
        return null;
    }

    const handleDelete = async (item: FavoriteSong) => {

    }

    const renderRightActions = (
        progress:  Animated.AnimatedInterpolation<string | number>,
        dragX: Animated.AnimatedInterpolation<string | number>,
        item: FavoriteSong
    ) => {
        return (
            <View style={styles.rightAction}>
                <Pressable onPress={() => null}>
                    <AntDesign name="delete" size={24} color="white" />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={defaultStyle.container}>
            {loading ? (
                <ActivityIndicator size={"large"} color={"blue"} />
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
                            <SongListItem song_id={item.song_id}/>
                        </Swipeable>
                    }
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                />
            )}
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