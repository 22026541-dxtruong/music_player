package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "strconv"
)

// AddFavoriteArtist thêm nghệ sĩ vào danh sách yêu thích
func AddFavoriteArtistByUserID(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    artistIDStr := r.URL.Query().Get("artist_id")

    if userIDStr == "" || artistIDStr == "" {
        http.Error(w, "user_id and artist_id are required", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    artistID, err := strconv.Atoi(artistIDStr)
    if err != nil {
        http.Error(w, "invalid artist_id", http.StatusBadRequest)
        return
    }

    // Thêm nghệ sĩ vào danh sách yêu thích
    _, err = db.DB.Exec("INSERT INTO favorite_artist (user_id, artist_id) VALUES (?, ?)", userID, artistID)
    if err != nil {
        if err.Error() == "UNIQUE constraint failed: favorite_artist.user_id, favorite_artist.artist_id" {
            http.Error(w, "artist already in favorites", http.StatusConflict)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated) // Trả về mã 201 Created
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "favorite artist added"})
}

func AddFavoriteSongByUserID(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    songIDStr := r.URL.Query().Get("song_id")

    if userIDStr == "" || songIDStr == "" {
        http.Error(w, "user_id and song_id are required", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    songID, err := strconv.Atoi(songIDStr)
    if err != nil {
        http.Error(w, "invalid song_id", http.StatusBadRequest)
        return
    }

    // Thêm bài hát vào danh sách yêu thích
    _, err = db.DB.Exec("INSERT INTO favorite_song (user_id, song_id) VALUES (?, ?)", userID, songID)
    if err != nil {
        if err.Error() == "UNIQUE constraint failed: favorite_song.user_id, favorite_song.song_id" {
            http.Error(w, "song already in favorites", http.StatusConflict)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated) // Trả về mã 201 Created
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "favorite song added"})
}

func AddFavoriteAlbumByUserID(w http.ResponseWriter, r *http.Request) {
    userIDStr := r.URL.Query().Get("user_id")
    albumIDStr := r.URL.Query().Get("album_id")

    if userIDStr == "" || albumIDStr == "" {
        http.Error(w, "user_id and album_id are required", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    albumID, err := strconv.Atoi(albumIDStr)
    if err != nil {
        http.Error(w, "invalid album_id", http.StatusBadRequest)
        return
    }

    // Thêm album vào danh sách yêu thích
    _, err = db.DB.Exec("INSERT INTO favorite_album (user_id, album_id) VALUES (?, ?)", userID, albumID)
    if err != nil {
        if err.Error() == "UNIQUE constraint failed: favorite_album.user_id, favorite_album.album_id" {
            http.Error(w, "album already in favorites", http.StatusConflict)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated) // Trả về mã 201 Created
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "favorite album added"})
}

func GetFavoriteAlbumsByUserID(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query("SELECT album_id FROM favorite_album WHERE user_id = ?", userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favorites []models.FavoriteAlbum
    for rows.Next() {
        var favorite models.FavoriteAlbum
        if err := rows.Scan(&favorite.AlbumID); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        favorite.UserID = userID
        favorites = append(favorites, favorite)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favorites)
}

func GetFavoriteArtistsByUserID(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query("SELECT artist_id FROM favorite_artist WHERE user_id = ?", userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favorites []models.FavoriteArtist
    for rows.Next() {
        var favorite models.FavoriteArtist
        if err := rows.Scan(&favorite.ArtistID); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        favorite.UserID = userID
        favorites = append(favorites, favorite)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favorites)
}

func GetFavoriteSongsByUserID(w http.ResponseWriter, r *http.Request) {
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

    rows, err := db.DB.Query("SELECT song_id FROM favorite_song WHERE user_id = ?", userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favorites []models.FavoriteSong
    for rows.Next() {
        var favorite models.FavoriteSong
        if err := rows.Scan(&favorite.SongID); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        favorite.UserID = userID
        favorites = append(favorites, favorite)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favorites)
}

