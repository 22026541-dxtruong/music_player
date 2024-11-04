import React from 'react'
import {View} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultStyle} from "@/constants/styles";

const AlbumScreen = () => {
    const inset = useSafeAreaInsets()
    return (
        <View style={{...defaultStyle.container, paddingTop: inset.top}}>

        </View>
    )
}

export default AlbumScreen