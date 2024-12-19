import {Stack} from "expo-router";
import AudioContextProvider from "@/context/AudioContext";
import DownloadContextProvider from "@/context/DownloadContext";
import AuthContextProvider from "@/context/AuthContext";
import {SQLiteDatabase, SQLiteProvider} from "expo-sqlite";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const initializeDatabase = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync(`
            PRAGMA foreign_keys = ON;
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS songs (
                song_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                album_id INTEGER,
                artist_id INTEGER,
                image TEXT,
                file_path TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS user_download_song (
                user_id INTEGER NOT NULL,
                song_id INTEGER NOT NULL,
                PRIMARY KEY (user_id,song_id),
                CONSTRAINT user_download_song_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                CONSTRAINT user_download_song_ibfk_2 FOREIGN KEY (song_id) REFERENCES songs (song_id)
            );
        `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

const RootLayout = () => {

    return (

        <GestureHandlerRootView style={{flex: 1}}>
            <SQLiteProvider databaseName={'music_player.db'} onInit={initializeDatabase}>
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
                                <Stack.Screen name="(drawer)"/>
                                <Stack.Screen name="artists"/>
                                <Stack.Screen name="albums"/>
                                <Stack.Screen name="genre/[index]"/>
                                <Stack.Screen name="songs"/>
                                <Stack.Screen name="playlists/[index]" options={{headerShown: true}}/>
                            </Stack>
                        </DownloadContextProvider>
                    </AudioContextProvider>
                </AuthContextProvider>
            </SQLiteProvider>
        </GestureHandlerRootView>
    );
};

export default RootLayout;
