package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "database/sql"
    "strconv"
)

func GetSongs(w http.ResponseWriter, r *http.Request) {
    rows, err := db.DB.Query("SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image FROM song")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func GetSongByID(w http.ResponseWriter, r *http.Request) {
    songIDStr := r.URL.Query().Get("song_id")
    if songIDStr == "" {
        http.Error(w, "song_id is required", http.StatusBadRequest)
        return
    }

    songID, err := strconv.Atoi(songIDStr)
    if err != nil {
        http.Error(w, "invalid song_id", http.StatusBadRequest)
        return
    }

    var song models.Song
    err = db.DB.QueryRow(`
        SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image
        FROM song
        WHERE song_id = ?`, songID).Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image)

    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "song not found", http.StatusNotFound)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(song)
}

func GetSongsByGenre(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query(`
        SELECT s.song_id, s.title, s.album_id, s.artist_id, s.duration, s.created_at, s.file_path, s.image
        FROM song s
        JOIN song_genre sg ON s.song_id = sg.song_id
        WHERE sg.genre_id = ?`, genreID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song // Đảm bảo bạn đã định nghĩa model Song đúng cách
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func GetSongsByAlbum(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query(`
        SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image
        FROM song
        WHERE album_id = ?`, albumID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song // Đảm bảo bạn đã định nghĩa model Song đúng cách
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func GetSongsByPlaylist(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query(`
        SELECT s.song_id, s.title, s.album_id, s.artist_id, s.duration, s.created_at, s.file_path, s.image
        FROM song s
        JOIN playlist_song ps ON s.song_id = ps.song_id
        WHERE ps.playlist_id = ?`, playlistID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song // Đảm bảo bạn đã định nghĩa model Song đúng cách
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func GetSongsByArtistId(w http.ResponseWriter, r *http.Request) {
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
        SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image
        FROM song
        WHERE artist_id = ?`, artistID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}
