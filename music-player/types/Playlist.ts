type Playlist = {
    playlist_id: number;
    user_id: number;
    name: string;
    image?: string;
}

type PlaylistSong = {
    playlist_id: number;
    song_id: number
}