import React, {createContext, useContext} from "react";
import useDownload from "@/hooks/useDownload";

type DownloadContextType = {
    downloadSong: Song | null
    downloadFile: (song: Song) => Promise<undefined | string>
    isCanceled: boolean
    isDownloading: boolean
    deleteFile: (song: Song) => Promise<void>
    downloadProgress: number
    error: string | null
    cancelDownload: () => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export const useDownloadContext = () => {
    const context = useContext(DownloadContext)
    if (!context) {
        throw new Error('useDownloadContext must be used within a DownloadContextProvider')
    }
    return context
}

const DownloadContextProvider = ({ children }: { children: React.ReactNode }) => {

    const download = useDownload()

    return (
        <DownloadContext.Provider value={download}>
            {children}
        </DownloadContext.Provider>
    );
};

export default DownloadContextProvider
