import React, {createContext, useContext} from 'react';
import useAudio from '@/hooks/useAudio';

type AudioContextType = {
    currentSong: Song | null;
    toggleRepeat: (isRepeating: boolean) => void;
    play: (newTrack: Song) => Promise<void>;
    pause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    resume: () => Promise<void>;
    isPlaying: boolean;
    getCurrentPosition: () => Promise<number>;
    setPosition: (position: number) => Promise<void>;
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
