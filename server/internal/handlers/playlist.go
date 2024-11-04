package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "strconv"
    "database/sql"
)

func GetPlaylists(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT playlist_id, user_id, name, created_at FROM playlist")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var playlists []models.Playlist
    for rows.Next() {
        var playlist models.Playlist
        if err := rows.Scan(&playlist.PlaylistID, &playlist.UserID, &playlist.Name, &playlist.CreatedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        playlists = append(playlists, playlist)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(playlists)
}

func GetPlaylistsByUserID(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    if userIDStr == "" {
        http.Error(w, "user_id is required", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query("SELECT playlist_id, name, created_at FROM playlist WHERE user_id = ?", userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var playlists []models.Playlist // Đảm bảo bạn đã định nghĩa model Playlist đúng cách
    for rows.Next() {
        var playlist models.Playlist
        if err := rows.Scan(&playlist.PlaylistID, &playlist.Name, &playlist.CreatedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        playlists = append(playlists, playlist)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(playlists)
}

func GetPlaylistByID(w http.ResponseWriter, r *http.Request) {
    playlistIDStr := r.URL.Query().Get("playlist_id")
    if playlistIDStr == "" {
        http.Error(w, "playlist_id is required", http.StatusBadRequest)
        return
    }

    playlistID, err := strconv.Atoi(playlistIDStr)
    if err != nil {
        http.Error(w, "invalid playlist_id", http.StatusBadRequest)
        return
    }

    var playlist models.Playlist // Đảm bảo bạn đã định nghĩa model Playlist đúng cách
    err = db.DB.QueryRow("SELECT playlist_id, user_id, name, created_at FROM playlist WHERE playlist_id = ?", playlistID).Scan(&playlist.PlaylistID, &playlist.UserID, &playlist.Name, &playlist.CreatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "playlist not found", http.StatusNotFound)
        } else {
            http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(playlist)
}

func AddSongToPlaylist(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    playlistIDStr := r.URL.Query().Get("playlist_id")
    songIDStr := r.URL.Query().Get("song_id")

    if userIDStr == "" || playlistIDStr == "" || songIDStr == "" {
        http.Error(w, "user_id, playlist_id and song_id are required", http.StatusBadRequest)
        return
    }

    _, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    playlistID, err := strconv.Atoi(playlistIDStr)
    if err != nil {
        http.Error(w, "invalid playlist_id", http.StatusBadRequest)
        return
    }

    songID, err := strconv.Atoi(songIDStr)
    if err != nil {
        http.Error(w, "invalid song_id", http.StatusBadRequest)
        return
    }

    // Thêm bài hát vào playlist
    _, err = db.DB.Exec("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)", playlistID, songID)
    if err != nil {
        if err.Error() == "UNIQUE constraint failed: playlist_song.playlist_id, playlist_song.song_id" {
            http.Error(w, "song already in playlist", http.StatusConflict)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated) // Trả về mã 201 Created
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "song added to playlist"})
}

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    name := r.URL.Query().Get("name")

    if userIDStr == "" || name == "" {
        http.Error(w, "user_id and name are required", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    // Thêm playlist vào cơ sở dữ liệu
    result, err := db.DB.Exec("INSERT INTO playlist (user_id, name) VALUES (?, ?)", userID, name)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    playlistID, err := result.LastInsertId()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated) // Trả về mã 201 Created
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message":    "playlist created",
        "playlist_id": playlistID,
    })
}

