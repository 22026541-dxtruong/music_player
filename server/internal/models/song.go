package models

import "database/sql"

type Song struct {
    SongID   int    `json:"song_id"`
    Title    string `json:"title"`
    AlbumID  sql.NullInt64    `json:"album_id"`
    ArtistID int    `json:"artist_id"`
    Duration sql.NullInt64    `json:"duration"`
    CreatedAt string `json:"created_at"`
	FilePath string `json:"file_path"`
	Image string `json:"image"`
}
