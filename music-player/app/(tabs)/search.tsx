import {router} from 'expo-router'
import React from 'react'
import {Pressable, ScrollView, Text, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";

const SearchScreen = () => {
    return (
        <View style={defaultStyle.container}>
            <ScrollView style={{flex: 1}}>
                <Pressable onPress={() => router.push('/songs')}>
                    <Text>SearchScreen</Text>
                </Pressable>
            </ScrollView>
            <FloatingPlayer />
        </View>
    )
}

export default SearchScreen