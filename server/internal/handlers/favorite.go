package handlers

import (
	"encoding/json"
	"music_player/internal/db"
	"music_player/internal/models"
	"music_player/internal/utils"
	"net/http"
	"strconv"
)

func AddFavoriteArtistByUserID(w http.ResponseWriter, r *http.Request) {
	var reqBody models.FavoriteArtist

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, `{"error": "invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if reqBody.UserID == 0 || reqBody.ArtistID == 0 {
		http.Error(w, "user_id and artist_id are required", http.StatusBadRequest)
		return
	}

	// Thêm nghệ sĩ vào danh sách yêu thích
	_, err = db.DB.Exec("INSERT INTO favorite_artist (user_id, artist_id) VALUES (?, ?)", reqBody.UserID, reqBody.ArtistID)
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
	var reqBody models.FavoriteSong

	err := json.NewDecoder(r.Body).Decode(&reqBody)

	if err != nil {
		http.Error(w, `{"error": "invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if reqBody.UserID == 0 || reqBody.SongID == 0 {
		http.Error(w, "user_id and song_id are required", http.StatusBadRequest)
		return
	}

	// Thêm bài hát vào danh sách yêu thích
	_, err = db.DB.Exec("INSERT INTO favorite_song (user_id, song_id) VALUES (?, ?)", reqBody.UserID, reqBody.SongID)
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
	var reqBody models.FavoriteAlbum

	err := json.NewDecoder(r.Body).Decode(&reqBody)

	if err != nil {
		http.Error(w, `{"error": "invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if reqBody.UserID == 0 || reqBody.AlbumID == 0 {
		http.Error(w, "user_id and album_id are required", http.StatusBadRequest)
		return
	}

	// Thêm album vào danh sách yêu thích
	_, err = db.DB.Exec("INSERT INTO favorite_album (user_id, album_id) VALUES (?, ?)", reqBody.UserID, reqBody.AlbumID)
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

    rows, err := db.DB.Query(`
        SELECT 
            a.album_id, 
            a.title, 
            a.artist_id,
			a.image
        FROM 
            favorite_album fa
        JOIN 
            album a ON fa.album_id = a.album_id
        WHERE 
            fa.user_id = ?`, userID)

    if err != nil {
        http.Error(w, "failed to fetch favorite albums: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favoriteAlbums []models.Album
    for rows.Next() {
        var album models.Album
        if err := rows.Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image); err != nil {
            http.Error(w, "failed to scan album: "+err.Error(), http.StatusInternalServerError)
            return
        }
        favoriteAlbums = append(favoriteAlbums, album)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over favorite albums: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favoriteAlbums)
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

    rows, err := db.DB.Query(`
        SELECT 
            ar.artist_id, 
            ar.name,
			ar.image, 
            ar.bio, 
            ar.created_at
        FROM 
            favorite_artist fa
        JOIN 
            artist ar ON fa.artist_id = ar.artist_id
        WHERE 
            fa.user_id = ?`, userID)

    if err != nil {
        http.Error(w, "failed to fetch favorite artists: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favoriteArtists []models.Artist
    for rows.Next() {
        var artist models.Artist
        if err := rows.Scan(&artist.ArtistID, &artist.Name, &artist.Image, &artist.Bio, &artist.CreatedAt); err != nil {
            http.Error(w, "failed to scan artist: "+err.Error(), http.StatusInternalServerError)
            return
        }
        favoriteArtists = append(favoriteArtists, artist)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over favorite artists: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favoriteArtists)
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

    // Truy vấn thông tin chi tiết các bài hát yêu thích
    rows, err := db.DB.Query(`
        SELECT 
            s.song_id, 
            s.title, 
            s.album_id, 
            s.artist_id, 
            s.duration, 
            s.created_at, 
            s.file_path, 
            s.image
        FROM 
            favorite_song fs
        JOIN 
            song s ON fs.song_id = s.song_id
        WHERE 
            fs.user_id = ?`, userID)

    if err != nil {
        http.Error(w, "failed to fetch favorite songs: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var favoriteSongs []models.Song
	api := utils.GetAPIUrlAndPort()
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, "failed to scan song: "+err.Error(), http.StatusInternalServerError)
            return
        }
		song.FilePath = api + song.FilePath
        favoriteSongs = append(favoriteSongs, song)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over favorite songs: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(favoriteSongs)
}

func DeleteFavoriteSongByUserID(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

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

	result, err := db.DB.Exec("DELETE FROM favorite_song WHERE user_id = ? AND song_id = ?", userID, songID)
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
		http.Error(w, "favorite song not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "favorite song deleted"})
}

func DeleteFavoriteAlbumByUserID(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

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

	result, err := db.DB.Exec("DELETE FROM favorite_album WHERE user_id = ? AND album_id = ?", userID, albumID)
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
		http.Error(w, "favorite album not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "favorite album deleted"})
}

func DeleteFavoriteArtistByUserID(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

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

	result, err := db.DB.Exec("DELETE FROM favorite_artist WHERE user_id = ? AND artist_id = ?", userID, artistID)
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
		http.Error(w, "favorite artist not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "favorite artist deleted"})
}
