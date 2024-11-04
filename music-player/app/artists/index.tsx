import React from 'react'
import {Text, View} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultStyle} from "@/constants/styles";

const ArtistList = () => {
    const inset = useSafeAreaInsets()
    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>
            <Text>Hello</Text>
        </View>
    )
}

export default ArtistList