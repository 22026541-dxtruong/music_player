package handlers

import (
	"database/sql"
	"encoding/json"
	"music_player/internal/db"
	"music_player/internal/models"
    "music_player/internal/utils"
	"net/http"
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
    userIDStr := r.URL.Query().Get("user_id")
    if songIDStr == "" || userIDStr == "" {
        http.Error(w, "song_id and user_id are required", http.StatusBadRequest)
        return
    }

    if songIDStr == "" {
        http.Error(w, "song_id and user_id are required", http.StatusBadRequest)
        return
    }

    songID, err := strconv.Atoi(songIDStr)
    if err != nil {
        http.Error(w, "invalid song_id", http.StatusBadRequest)
        return
    }

    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        http.Error(w, "invalid user_id", http.StatusBadRequest)
        return
    }

    var song models.Song
    // Bắt đầu transaction
    tx, err := db.DB.Begin()
    if err != nil {
        http.Error(w, "failed to begin transaction", http.StatusInternalServerError)
        return
    }

    defer func() {
        if p := recover(); p != nil {
            tx.Rollback()
            panic(p)
        } else if err != nil {
            tx.Rollback()
        } else {
            tx.Commit()
        }
    }()

    // Truy vấn thông tin bài hát
    err = tx.QueryRow(`
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
    _, err = tx.Exec(`
        INSERT INTO user_song_history (user_id, song_id, last_played, play_count)
        VALUES (?, ?, CURRENT_TIMESTAMP, 1)
        ON DUPLICATE KEY UPDATE
            play_count = IFNULL(play_count, 0) + 1,
            last_played = CURRENT_TIMESTAMP`, userID, songID)

    if err != nil {
        http.Error(w, "failed to update user_song_history", http.StatusInternalServerError)
        return
    }

    // Debug thông tin số dòng bị ảnh hưởng
//     affectedRows, _ := result.RowsAffected()
//     fmt.Printf("Updated or inserted %d rows in user_song_history\n", affectedRows)

    // Trả về thông tin bài hát
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(song)
}

func GetUserSongHistory(w http.ResponseWriter, r *http.Request) {
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

    // Truy vấn lịch sử bài hát của người dùng
    rows, err := db.DB.Query(`
        SELECT s.song_id, s.title, s.album_id, s.artist_id, s.duration, s.created_at, s.file_path, s.image
        FROM user_song_history sh
        JOIN song s ON s.song_id = sh.song_id
        WHERE sh.user_id = ?
        ORDER BY sh.last_played DESC`, userID)

    if err != nil {
        http.Error(w, "failed to fetch user song history: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var history []models.Song
    api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var songHistory models.Song
        err := rows.Scan(&songHistory.SongID, &songHistory.Title, &songHistory.AlbumID, &songHistory.ArtistID, &songHistory.Duration, &songHistory.CreatedAt, &songHistory.FilePath, &songHistory.Image)
        if err != nil {
            http.Error(w, "failed to scan song history: "+err.Error(), http.StatusInternalServerError)
            return
        }
        songHistory.FilePath = api + songHistory.FilePath
        history = append(history, songHistory)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over song history: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về lịch sử bài hát dưới dạng JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(history)
}

func DeleteSongHistory(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
   		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
  		return
    }

    userIDStr := r.URL.Query().Get("user_id")
    songIDStr := r.URL.Query().Get("song_id")

    // Kiểm tra xem cả user_id và song_id có được cung cấp không
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

    // Thực hiện truy vấn xóa lịch sử bài hát
    _, err = db.DB.Exec(`
        DELETE FROM user_song_history
        WHERE user_id = ? AND song_id = ?`, userID, songID)

    if err != nil {
        http.Error(w, "failed to delete song history: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về phản hồi thành công
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Song history deleted successfully"))
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

    var songs []models.Song 
    api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        song.FilePath = api + song.FilePath
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

    var songs []models.Song
    api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        song.FilePath = api + song.FilePath
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

    var songs []models.Song
    api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        song.FilePath = api + song.FilePath
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
    api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        song.FilePath = api + song.FilePath
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}
