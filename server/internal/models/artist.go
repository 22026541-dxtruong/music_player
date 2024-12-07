package models

type Artist struct {
    ArtistID    int    `json:"artist_id"`
    Name        string `json:"name"`
    Bio         string `json:"bio"`
    CreatedAt   string `json:"created_at"`
    Image       string `json:"image"`
}
