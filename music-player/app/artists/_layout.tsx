import React from 'react';
import {Stack} from "expo-router";

const ArtistLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Artists",
                }}
            />
            <Stack.Screen
                name='[artist]'
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}

export default ArtistLayout;