package models

type FavoriteArtist struct {
    UserID   int `json:"user_id"`
    ArtistID int `json:"artist_id"`
}

type FavoriteAlbum struct {
    UserID  int `json:"user_id"`
    AlbumID int `json:"album_id"`
}

type FavoriteSong struct {
    UserID int `json:"user_id"`
    SongID int `json:"song_id"`
}
