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
            />
        </Stack>
    );
}

export default ArtistLayout;