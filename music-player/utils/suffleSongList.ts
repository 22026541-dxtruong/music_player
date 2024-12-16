export const shuffleSongList = (songList: Song[], currentSongIndex: number): Song[] => {

    const remainingSongs = songList.slice(currentSongIndex + 1);

    for (let i = remainingSongs.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [remainingSongs[i], remainingSongs[randomIndex]] = [remainingSongs[randomIndex], remainingSongs[i]];
    }

    return [
        ...songList.slice(0, currentSongIndex + 1),
        ...remainingSongs
    ];
};
