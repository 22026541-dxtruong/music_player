import {router} from 'expo-router'
import React from 'react'
import {Pressable, Text} from 'react-native'

const SearchScreen = () => {
    return (
        <Pressable onPress={() => router.push('/songs')}>
            <Text>SearchScreen</Text>
        </Pressable>
    )
}

export default SearchScreen