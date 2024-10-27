import React, { createContext, useContext } from 'react';
import useAudio, { Track } from '@/hooks/useAudio';

type AudioContextType = {
    currentTrack: Track | null;
    play: (newTrack: Track) => Promise<void>;
    pause: () => Promise<void>;
    rewind: (seconds: number) => Promise<void>;
    isPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioContextProvider');
    }
    return context;
};

const AudioContextProvider = ({ children }: { children: React.ReactNode }) => {

    const audio = useAudio()

    return (
        <AudioContext.Provider value={audio}>
            {children}
        </AudioContext.Provider>
    );
};

export default AudioContextProvider;
