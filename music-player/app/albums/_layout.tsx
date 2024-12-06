import {Stack} from "expo-router";
import React from "react";

const AlbumLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Albums",
                }}
            />
            <Stack.Screen
                name='[album]'
            />
        </Stack>
    );
}

export default AlbumLayout;