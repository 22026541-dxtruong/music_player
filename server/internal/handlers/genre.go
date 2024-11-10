package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "strconv"
    "database/sql"
)

func GetGenres(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT genre_id, name, content, image FROM genre")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var genres []models.Genre
    for rows.Next() {
        var genre models.Genre
        if err := rows.Scan(&genre.GenreID, &genre.Name, &genre.Content, &genre.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        genres = append(genres, genre)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(genres)
}

func GetGenreById(w http.ResponseWriter, r *http.Request) {
    genreIDStr := r.URL.Query().Get("genre_id")
        if genreIDStr == "" {
            http.Error(w, "genre_id is required", http.StatusBadRequest)
            return
        }

        genreID, err := strconv.Atoi(genreIDStr)
        if err != nil {
            http.Error(w, "invalid genre_id", http.StatusBadRequest)
            return
        }

        var genre models.Genre
        err = db.DB.QueryRow("SELECT genre_id, name, content, image FROM genre WHERE genre_id = ?", genreID).Scan(&genre.GenreID, &genre.Name, &genre.Content, &genre.Image)
        if err != nil {
            if err == sql.ErrNoRows {
                http.Error(w, "artist not found", http.StatusNotFound)
            } else {
                http.Error(w, err.Error(), http.StatusInternalServerError)
            }
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(genre)
}

