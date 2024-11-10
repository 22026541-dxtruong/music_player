import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from "react";
import {Alert} from "react-native";

const useDownload = () => {
    const [downloadSong, setDownloadSong] = useState<Song | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [downloadUri, setDownloadUri] = useState<string | null>(null);
    const [downloadResumable, setDownloadResumable] = useState<FileSystem.DownloadResumable | null>(null);
    const [isCanceled, setIsCanceled] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const downloadFolder = FileSystem.documentDirectory + 'MusicPlayer/';

    // Hàm tải xuống file
    const downloadFile = useCallback(async (song: Song) => {
        setDownloadSong(song);
        setIsDownloading(true);
        setDownloadProgress(0);
        setError(null);
        setIsCanceled(false); // Reset trạng thái hủy mỗi lần tải xuống mới
        setIsPaused(false); // Reset trạng thái tạm dừng

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
                Alert.alert("File đã tồn tại", `Hãy kiểm tra lại ${song.title} trong thư viện của bạn`)
                setDownloadProgress(0)
                setDownloadSong(null)
                setIsCanceled(true); // Đánh dấu trạng thái hủy
                setIsDownloading(false); // Đánh dấu trạng thái là không đang tải
                setDownloadSong(null);
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

            setDownloadUri(result.uri);
            setIsDownloading(false);
            setDownloadProgress(1); // Đánh dấu hoàn thành
            setDownloadSong(null);
            console.log('Tải xuống thành công:', result.uri);

            return result.uri;

        } catch (err: any) {
            setIsDownloading(false);
            setError(err.message || 'Đã xảy ra lỗi trong quá trình tải xuống');
            console.error('Lỗi tải file:', err);
            throw err;
        }
    }, [isDownloading, isPaused, isCanceled]);
    // Hàm tạm dừng tải xuống
    const pauseDownload = useCallback(() => {
        if (downloadResumable) {
            downloadResumable.pauseAsync(); // Tạm dừng tải xuống
            setIsPaused(true); // Đặt trạng thái là tạm dừng
            setIsDownloading(false); // Đánh dấu trạng thái là không đang tải
            console.log('Tải xuống đã bị tạm dừng');
        }
    }, [downloadResumable]);

    // Hàm tiếp tục tải xuống
    const resumeDownload = useCallback(() => {
        if (downloadResumable) {
            downloadResumable.resumeAsync(); // Tiếp tục tải xuống
            setIsPaused(false); // Đặt trạng thái là tiếp tục
            setIsDownloading(true); // Đánh dấu trạng thái là đang tải
            console.log('Tiếp tục tải xuống');
        }
    }, [downloadResumable]);

    // Hàm hủy tải xuống
    const cancelDownload = useCallback(() => {
        if (downloadResumable) {
            setIsCanceled(true); // Đánh dấu trạng thái hủy
            downloadResumable.pauseAsync(); // Tạm dừng tải xuống
            setIsDownloading(false); // Đánh dấu trạng thái là không đang tải
            setDownloadSong(null); // Reset bài hát đang tải
            console.log('Tải xuống đã bị hủy');
        }
    }, [downloadResumable]);

    const deleteFile = async (fileUri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (fileInfo.exists) {
                await FileSystem.deleteAsync(fileUri);
                console.log(`Đã xóa file: ${fileUri}`);
            } else {
                console.log('File không tồn tại.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa file:', error);
        }
    };

    useEffect(() => {
        if (isCanceled) {
            // Nếu bị hủy, đặt lại tất cả
            setDownloadProgress(0);
            setIsDownloading(false);
            setDownloadSong(null);
        } else if (isPaused) {
            // Nếu bị tạm dừng, chỉ cập nhật trạng thái
            setIsDownloading(false);
        }
    }, [isCanceled, isPaused]);

    return {
        downloadSong,
        isDownloading,
        downloadProgress,
        error,
        downloadUri,
        downloadFile,
        pauseDownload, // Trả về hàm pauseDownload để tạm dừng
        resumeDownload, // Trả về hàm resumeDownload để tiếp tục
        cancelDownload, // Trả về hàm cancelDownload để hủy tải
        deleteFile,
        isPaused, // Trả về trạng thái tạm dừng
        isCanceled, // Trả về trạng thái hủy
    };
};

export default useDownload;
