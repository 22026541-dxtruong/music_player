package models

type Album struct {
    AlbumID    int    `json:"album_id"`
    Title      string `json:"title"`
    ArtistID   int    `json:"artist_id"`
    Image      string `json:"image"`
    CreatedAt  string `json:"created_at"`
}
