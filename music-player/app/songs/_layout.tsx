import {Stack} from "expo-router";
import React from "react";

const SongsLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Liked Songs",
                }}
            />
            <Stack.Screen
                name='[song]'
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
};

export default SongsLayout;
