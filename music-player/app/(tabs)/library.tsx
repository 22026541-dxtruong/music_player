import React from 'react'
import {Pressable, ScrollView, Text, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import FloatingDownload from "@/components/FloatingDownload";
import {useAuthContext} from "@/context/AuthContext";

const LibraryScreen = () => {
    const { logout } = useAuthContext()
    return (
        <View style={defaultStyle.container}>
            <FloatingDownload />
            <ScrollView style={{flex: 1}}>
                <Text>LibraryScreen</Text>
                <Pressable onPress={() => logout()}>
                    <Text>Logout</Text>
                </Pressable>
            </ScrollView>
            <FloatingPlayer />
        </View>
    )
}

export default LibraryScreen