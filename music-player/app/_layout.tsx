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
                <Stack.Screen name="artists"/>
                <Stack.Screen name="album/[index]" options={{ headerShown: true}}/>
                <Stack.Screen name="genres/index"/>
                <Stack.Screen name="genres/[genre]"/>
                <Stack.Screen name="songs"/>
                <Stack.Screen name="playlists"/>
            </Stack>
        </AudioContextProvider>
    );
};

export default RootLayout;
