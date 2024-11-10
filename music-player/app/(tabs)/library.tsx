import React from 'react'
import {ScrollView, Text, View} from 'react-native'
import FloatingPlayer from "@/components/FloatingPlayer";
import {defaultStyle} from "@/constants/styles";
import FloatingDownload from "@/components/FloatingDownload";

const LibraryScreen = () => {
    return (
        <View style={defaultStyle.container}>
            <FloatingDownload />
            <ScrollView style={{flex: 1}}>
                <Text>LibraryScreen</Text>
            </ScrollView>
            <FloatingPlayer />
        </View>
    )
}

export default LibraryScreen