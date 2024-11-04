package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "strconv"
    "database/sql"
)

func GetArtists(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT artist_id, name, bio, created_at, image FROM artist")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var artists []models.Artist
    for rows.Next() {
        var artist models.Artist
        if err := rows.Scan(&artist.ArtistID, &artist.Name, &artist.Bio, &artist.CreatedAt, &artist.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        artists = append(artists, artist)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(artists)
}

func GetArtistByID(w http.ResponseWriter, r *http.Request) {
    artistIDStr := r.URL.Query().Get("artist_id")
    if artistIDStr == "" {
        http.Error(w, "artist_id is required", http.StatusBadRequest)
        return
    }

    artistID, err := strconv.Atoi(artistIDStr)
    if err != nil {
        http.Error(w, "invalid artist_id", http.StatusBadRequest)
        return
    }

    var artist models.Artist // Đảm bảo bạn đã định nghĩa model Artist đúng cách
    err = db.DB.QueryRow("SELECT artist_id, name, bio, created_at, image FROM artist WHERE artist_id = ?", artistID).Scan(&artist.ArtistID, &artist.Name, &artist.Bio, &artist.CreatedAt, &artist.Image)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "artist not found", http.StatusNotFound)
        } else {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(artist)
}
