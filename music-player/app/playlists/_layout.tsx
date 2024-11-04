import React from 'react';
import {Stack} from "expo-router";

const PlaylistLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Playlist",
                }}
            />
            <Stack.Screen
                name='[playlist]'
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}

export default PlaylistLayout;