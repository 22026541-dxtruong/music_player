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

func AddSongToPlaylists(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

    var request struct {
    	UserID      int     `json:"user_id"`
    	PlaylistIDs []int   `json:"playlist_ids"`
    	SongID      int     `json:"song_id"`
   	}

   	err := json.NewDecoder(r.Body).Decode(&request)
   	if err != nil {
   		http.Error(w, `{"error": "invalid JSON format"}`, http.StatusBadRequest)
   		return
    }
	// Kiểm tra tính hợp lệ của các tham số
    if request.UserID == 0 || len(request.PlaylistIDs) == 0 || request.SongID == 0 {
   		http.Error(w, "user_id, playlist_ids and song_id are required", http.StatusBadRequest)
   		return
   	}

    // Thêm bài hát vào tất cả các playlist
   	for _, playlistID := range request.PlaylistIDs {
   		_, err := db.DB.Exec("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)", playlistID, request.SongID)
   		if err != nil {
   			if err.Error() == "UNIQUE constraint failed: playlist_song.playlist_id, playlist_song.song_id" {
    			// Nếu bài hát đã có trong playlist này thì bỏ qua và tiếp tục
    			continue
    		}
            http.Error(w, err.Error(), http.StatusInternalServerError)
    		return
    	}
    }

    // Trả về phản hồi thành công
   	w.WriteHeader(http.StatusCreated)
   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]string{"message": "song added to playlists"})
}

func CreatePlaylist(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var reqBody struct {
		UserID int    `json:"user_id"`
		Name   string `json:"name"`
	}

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, `{"error": "invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if reqBody.UserID == 0 || reqBody.Name == "" {
		http.Error(w, "user_id and name are required", http.StatusBadRequest)
		return
	}

	// Thêm playlist vào cơ sở dữ liệu
	result, err := db.DB.Exec("INSERT INTO playlist (user_id, name) VALUES (?, ?)", reqBody.UserID, reqBody.Name)
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
		"message":     "playlist created",
		"playlist_id": playlistID,
	})
}

func GetSongsByPlaylistID(w http.ResponseWriter, r *http.Request) {
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
        SELECT 
            s.song_id, 
            s.title, 
            s.album_id, 
            s.artist_id,
            s.file_path, 
            s.image, 
            s.created_at
        FROM 
            playlist_song ps
        JOIN 
            song s ON ps.song_id = s.song_id
        WHERE 
            ps.playlist_id = ?`, playlistID)

    if err != nil {
        http.Error(w, "failed to fetch songs in playlist: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var playlistSongs []models.Song
	api := utils.GetAPIHostAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.FilePath, &song.Image, &song.CreatedAt); err != nil {
            http.Error(w, "failed to scan song: "+err.Error(), http.StatusInternalServerError)
            return
        }
		song.FilePath = api + song.FilePath
        playlistSongs = append(playlistSongs, song)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over songs: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(playlistSongs)
}

func DeletePlaylistByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
    
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

	// Xóa dữ liệu liên quan trong bảng playlist_song
	result, err := db.DB.Exec(`DELETE FROM playlist_song WHERE playlist_id = ?`, playlistID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Xóa dữ liệu trong bảng playlist
	result, err = db.DB.Exec(`DELETE FROM playlist WHERE playlist_id = ?`, playlistID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err = result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Playlist not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "playlist deleted"})
}

func DeleteSongInPlaylist(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
   		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
   		return
    }

   	playlistIDStr := r.URL.Query().Get("playlist_id")
   	songIDStr := r.URL.Query().Get("song_id")

    if playlistIDStr == "" || songIDStr == "" {
   		http.Error(w, "playlist_id and song_id are required", http.StatusBadRequest)
   		return
   	}

    playlistID, err := strconv.Atoi(playlistIDStr)
   	if err != nil {
   		http.Error(w, "invalid playlist", http.StatusBadRequest)
   		return
   	}

    songID, err := strconv.Atoi(songIDStr)
   	if err != nil {
   		http.Error(w, "invalid song_id", http.StatusBadRequest)
   		return
   	}

    result, err := db.DB.Exec("DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?", playlistID, songID)
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

    rowsAffected, err := result.RowsAffected()
   	if err != nil {
   		http.Error(w, err.Error(), http.StatusInternalServerError)
   		return
   	}

    if rowsAffected == 0 {
   		http.Error(w, "song not found in playlist", http.StatusNotFound)
   		return
   	}

    w.WriteHeader(http.StatusOK)
   	w.Header().Set("Content-Type", "application/json")
   	json.NewEncoder(w).Encode(map[string]string{"message": "song deleted in playlist"})
}
