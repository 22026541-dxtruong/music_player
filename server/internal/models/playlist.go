package models

import "database/sql"

type Playlist struct {
	PlaylistID int              `json:"playlist_id"`
	UserID     int              `json:"user_id"`
	Name       string           `json:"name"`
	CreatedAt  string           `json:"created_at"`
	Image      sql.NullString   `json:"image"`
}

type PlaylistSong struct {
    PlaylistID int `json:"playlist_id"`
    SongID     int `json:"song_id"`
}
