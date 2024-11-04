package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "strconv"
    "database/sql"
)

func GetAlbums(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT album_id, title, artist_id, image, created_at FROM album")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var albums []models.Album
    for rows.Next() {
        var album models.Album
        if err := rows.Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image, &album.CreatedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        albums = append(albums, album)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(albums)
}

func GetAlbumByID(w http.ResponseWriter, r *http.Request) {
    albumIDStr := r.URL.Query().Get("album_id")
    if albumIDStr == "" {
        http.Error(w, "album_id is required", http.StatusBadRequest)
        return
    }

    albumID, err := strconv.Atoi(albumIDStr)
    if err != nil {
        http.Error(w, "invalid album_id", http.StatusBadRequest)
        return
    }

    var album models.Album // Đảm bảo bạn đã định nghĩa model Album đúng cách
    err = db.DB.QueryRow("SELECT album_id, title, artist_id, image, created_at FROM album WHERE album_id = ?", albumID).Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image, &album.CreatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "album not found", http.StatusNotFound)
        } else {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(album)
}

func GetAlbumsByArtistId(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query(`
        SELECT album_id, title, artist_id, image, created_at
        FROM album
        WHERE artist_id = ?`, artistID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var albums []models.Album
    for rows.Next() {
        var album models.Album
        if err := rows.Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image, &album.CreatedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        albums = append(albums, album)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(albums)
}
