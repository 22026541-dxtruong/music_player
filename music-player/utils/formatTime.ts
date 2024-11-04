export const formatTime = (duration: number | undefined) => {
    if (!duration) return '00:00';

    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
