import {Stack} from "expo-router";
import AudioContextProvider from "@/context/AudioContext";

const RootLayout = () => {

    return (
        <AudioContextProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="artists/index"/>
                <Stack.Screen name="artists/[artist]"/>
                <Stack.Screen name="album/[index]"/>
                <Stack.Screen name="genres/index"/>
                <Stack.Screen name="genres/[genre]"/>
                <Stack.Screen name="songs"/>
                <Stack.Screen name="playlists/index"/>
                <Stack.Screen name="playlists/[playlist]"/>
            </Stack>
        </AudioContextProvider>
    );
};

export default RootLayout;
