package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
)

func GetGenres(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT genre_id, name FROM genre")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var genres []models.Genre
    for rows.Next() {
        var genre models.Genre
        if err := rows.Scan(&genre.GenreID, &genre.Name); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        genres = append(genres, genre)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(genres)
}

