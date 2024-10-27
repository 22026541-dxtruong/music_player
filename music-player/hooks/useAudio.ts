import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Audio } from "expo-av";

export type Track = {
    id: number;
    url: string;
    title?: string;
    artist?: string;
    artwork?: string;
    rating?: number;
    playlist?: string[];
};

const useAudio = () => {
    const sound = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

    useEffect(() => {
        const setAudioMode = async () => {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: true
            });
        };

        setAudioMode().catch(console.error);

        return () => {
            if (sound.current) {
                sound.current.unloadAsync().catch(console.error);
            }
        };
    }, []);

    const loadSound = async (newTrack: Track) => {
        if (sound.current) {
            await sound.current.unloadAsync();
        }
        sound.current = new Audio.Sound();
        await sound.current.loadAsync({ uri: newTrack.url });
    };

    const play = useCallback(async (newTrack: Track) => {
        await loadSound(newTrack)
        await sound.current?.playAsync()
        setCurrentTrack(newTrack)
        setIsPlaying(true)
    }, [currentTrack]);

    const pause = useCallback(async () => {
        if (sound.current) {
            await sound.current.pauseAsync();
            setIsPlaying(false);
        }
    }, []);

    const rewind = useCallback(async (seconds: number) => {
        if (sound.current) {
            const status = await sound.current.getStatusAsync();
            if (status.isLoaded) {
                const newPosition = Math.max(0, status.positionMillis - seconds * 1000);
                await sound.current.setPositionAsync(newPosition);
            }
        }
    }, []);

    return useMemo(() => ({
        currentTrack,
        play,
        pause,
        rewind,
        isPlaying,
    }), [currentTrack, isPlaying]);
};

export default useAudio;
