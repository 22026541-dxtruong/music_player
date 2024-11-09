package models

type Genre struct {
    GenreID int    `json:"genre_id"`
    Name    string `json:"name"`
    Content string `json:"content"`
    Image   string `json:"image"`
}