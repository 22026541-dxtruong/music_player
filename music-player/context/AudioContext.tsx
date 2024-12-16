import React, {createContext, useContext, useState} from 'react';
import useAudio from '@/hooks/useAudio';

type AudioContextType = {
    currentSong: Song | null;
    loading: boolean;
    toggleRepeat: () => void;
    isRepeating: boolean;
    play: (newSong: Song) => Promise<void>;
    pause: () => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    resume: () => Promise<void>;
    isPlaying: boolean;
    getCurrentPosition: () => Promise<number>;
    setPosition: (position: number) => Promise<void>;
    autoNext: boolean;
    handlePlaySongList: (data?: Song[]) => Promise<void>;
    album: Album | undefined;
    setAlbum: React.Dispatch<React.SetStateAction<Album | undefined>>;
    songList: Song[];
    isShuffle: boolean;
    handleShuffle: () => void;
    songListIndex: number | undefined;
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
    const [album, setAlbum] = useState<Album>()

    return (
        <AudioContext.Provider value={{...audio, album, setAlbum}}>
            {children}
        </AudioContext.Provider>
    );
};

export default AudioContextProvider;
