import {Stack} from "expo-router";
import React from "react";

const SongsLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Songs"
                }}
            />
        </Stack>
    );
};

export default SongsLayout;
