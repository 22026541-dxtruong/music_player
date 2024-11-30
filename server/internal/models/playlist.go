package models

type Playlist struct {
    PlaylistID int    `json:"playlist_id"`
    UserID     int    `json:"user_id"`
    Name       string `json:"name"`
    CreatedAt  string `json:"created_at"`
}

type PlaylistSong struct {
    PlaylistID int `json:"playlist_id"`
    SongID     int `json:"song_id"`
}
