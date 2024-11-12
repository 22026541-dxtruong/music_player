import {Stack} from "expo-router";
import AudioContextProvider from "@/context/AudioContext";
import DownloadContextProvider from "@/context/DownloadContext";
import AuthContextProvider from "@/context/AuthContext";

const RootLayout = () => {

    return (
        <AuthContextProvider>
            <AudioContextProvider>
                <DownloadContextProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen name="login"/>
                        <Stack.Screen name="register"/>
                        <Stack.Screen name="(tabs)"/>
                        <Stack.Screen name="artists"/>
                        <Stack.Screen name="album/[index]" options={{ headerShown: true}}/>
                        <Stack.Screen name="genre/[index]"/>
                        <Stack.Screen name="songs"/>
                        <Stack.Screen name="playlists"/>
                    </Stack>
                </DownloadContextProvider>
            </AudioContextProvider>
        </AuthContextProvider>
    );
};

export default RootLayout;
