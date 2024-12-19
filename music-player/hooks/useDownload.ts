import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from "react";
import {useSQLiteContext} from "expo-sqlite";

const downloadFolder = FileSystem.documentDirectory + 'MusicPlayer/';

const useDownload = () => {
    const database = useSQLiteContext()
    const [downloadSong, setDownloadSong] = useState<Song | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [downloadResumable, setDownloadResumable] = useState<FileSystem.DownloadResumable | null>(null);
    const [isCanceled, setIsCanceled] = useState(false);

    const downloadFile = useCallback(async (song: Song, userId: number) => {
        setDownloadSong(song);
        setIsDownloading(true);
        setDownloadProgress(0);
        setError(null);
        setIsCanceled(false);

        try {
            if (!FileSystem.documentDirectory) {
                throw new Error('Document directory không hợp lệ.');
            }

            // Kiểm tra và tạo thư mục tải xuống nếu chưa có
            const dirInfo = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);

            if (!dirInfo.includes('MusicPlayer')) {
                await FileSystem.makeDirectoryAsync(downloadFolder, { intermediates: true });
                console.log('Thư mục đã được tạo:', downloadFolder);
            }

            // Đường dẫn file sẽ được tải về
            const fileUri = downloadFolder + song.title;

            const fileExists = await FileSystem.getInfoAsync(fileUri);

            if (fileExists.exists) {
                console.log("File đã tồn tại:", fileUri);
                setDownloadProgress(0)
                setDownloadSong(null)
                setIsCanceled(true);
                setIsDownloading(false);
                setDownloadSong(null);
                const insertUserDownload = await database.prepareAsync(`
                    INSERT OR IGNORE INTO user_download_song (user_id, song_id)
                    VALUES (?, ?)
                `);
                await insertUserDownload.executeAsync([userId, song.song_id]);
                return fileUri;  // Nếu file đã tồn tại, trả về URI.
            }

            // Tạo đối tượng downloadResumable để tải file
            const downloadResumableInstance = FileSystem.createDownloadResumable(
                song.file_path,
                fileUri,
                {},
                (downloadProgress) => {
                    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                    setDownloadProgress(progress);
                }
            );

            setDownloadResumable(downloadResumableInstance);

            const result = await downloadResumableInstance.downloadAsync();

            if (isCanceled) {
                console.log("Tải xuống đã bị hủy");
                await FileSystem.deleteAsync(fileUri);
                setDownloadProgress(0);
                setIsDownloading(false);
                setDownloadSong(null);
                return;
            }

            if (!result || result.status !== 200) {
                throw new Error('Không thể tải xuống tệp.');
            }

            setIsDownloading(false);
            setDownloadProgress(1);
            setDownloadSong(null);
            console.log('Tải xuống thành công:', result.uri);

            const statement = await database.prepareAsync(`INSERT OR IGNORE INTO songs (song_id, title, album_id, artist_id, image, file_path) VALUES (?, ?, ?, ?, ?, ?)`)
            await statement.executeAsync(song.song_id, song.title, song.album_id, song.artist_id, song.image, result.uri)
            const insertUserDownload = await database.prepareAsync(`
                INSERT INTO user_download_song (user_id, song_id)
                VALUES (?, ?)
            `);
            await insertUserDownload.executeAsync([userId, song.song_id]);

            return result.uri;

        } catch (err: any) {
            setIsDownloading(false);
            setError(err.message || 'Đã xảy ra lỗi trong quá trình tải xuống');
            console.error('Lỗi tải file:', err);
            throw err;
        }
    }, [isDownloading, isCanceled]);

    const cancelDownload = useCallback(() => {
        if (downloadResumable) {
            downloadResumable.pauseAsync().catch(console.error);
            setIsDownloading(false);
            setDownloadSong(null);
            console.log('Tải xuống đã bị hủy');
        }
    }, [downloadResumable]);

    const deleteFile = useCallback(async (song: Song, userId: number) => {
        try {
            const fileUri = downloadFolder + song.title;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (fileInfo.exists) {
                await FileSystem.deleteAsync(fileUri);
                const insertUserDownload = await database.prepareAsync(`
                    DELETE FROM user_download_song 
                    WHERE user_id=? AND song_id=?;
                `);
                await insertUserDownload.executeAsync([userId, song.song_id]);
                console.log(`Đã xóa file: ${fileUri}`);
            } else {
                console.log('File không tồn tại.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa file:', error);
        }
    }, [])

    useEffect(() => {
        if (isCanceled) {
            setDownloadProgress(0);
            setIsDownloading(false);
            setDownloadSong(null);
        }
    }, [isCanceled]);

    return {
        downloadSong,
        isDownloading,
        downloadProgress,
        error,
        downloadFile,
        cancelDownload, // Trả về hàm cancelDownload để hủy tải
        deleteFile,
        isCanceled, // Trả về trạng thái hủy
    };
};

export default useDownload;
