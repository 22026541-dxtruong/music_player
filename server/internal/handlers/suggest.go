package handlers

import (
	"encoding/json"
	"music_player/internal/db"
	"music_player/internal/models"
	"net/http"
	"strconv"
)

func GetSongTrend(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(`
        SELECT s.*
		FROM song s
		JOIN user_song_history ush ON s.song_id = ush.song_id
		WHERE ush.last_played >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
		GROUP BY s.song_id
		ORDER BY COUNT(ush.song_id) DESC, s.created_at DESC
		LIMIT 10;`)

    if err != nil {
        http.Error(w, "failed to fetch hot songs: " + err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var hotSongs []models.Song
    for rows.Next() {
        var hotSong models.Song
        err := rows.Scan(&hotSong.SongID, &hotSong.Title, &hotSong.AlbumID, &hotSong.ArtistID, &hotSong.Duration, &hotSong.CreatedAt, &hotSong.FilePath, &hotSong.Image)
        if err != nil {
            http.Error(w, "failed to scan hot song: " + err.Error(), http.StatusInternalServerError)
            return
        }
        hotSongs = append(hotSongs, hotSong)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over hot songs: " + err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về lịch sử bài hát dưới dạng JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(hotSongs)
}

func GetSongSuggestByUserID(w http.ResponseWriter, r *http.Request) {
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
        SELECT s.*
		FROM song s
		JOIN song_genre sg ON s.song_id = sg.song_id
		LEFT JOIN user_song_history ush ON s.song_id = ush.song_id
		WHERE sg.genre_id IN (
    		SELECT sg.genre_id
    		FROM user_song_history ush
    		JOIN song_genre sg ON ush.song_id = sg.song_id
    		WHERE ush.user_id = ?
		)
		AND s.song_id NOT IN (
    		SELECT song_id
    		FROM user_song_history
    		WHERE user_id = ?
		)
		GROUP BY s.song_id
		ORDER BY s.created_at DESC, COUNT(ush.song_id) DESC
		LIMIT 10;`, userID, userID)

    if err != nil {
        http.Error(w, "failed to fetch suggest songs: " + err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var suggestSongs []models.Song
    for rows.Next() {
        var suggestSong models.Song
        err := rows.Scan(&suggestSong.SongID, &suggestSong.Title, &suggestSong.AlbumID, &suggestSong.ArtistID, &suggestSong.Duration, &suggestSong.CreatedAt, &suggestSong.FilePath, &suggestSong.Image)
        if err != nil {
            http.Error(w, "failed to scan suggest song: "+err.Error(), http.StatusInternalServerError)
            return
        }
        suggestSongs = append(suggestSongs, suggestSong)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over suggest songs: " + err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về lịch sử bài hát dưới dạng JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(suggestSongs)
}

func GetAlbumSuggestByUserID(w http.ResponseWriter, r *http.Request) {
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
        SELECT a.*
		FROM album a
		LEFT JOIN song s ON a.album_id = s.album_id
		WHERE a.artist_id IN (
    		SELECT artist_id
    		FROM favorite_artist
    		WHERE user_id = ?
		)
		AND a.album_id NOT IN (
    		SELECT album_id
    		FROM favorite_album
    		WHERE user_id = ?
		)
		GROUP BY a.album_id
		ORDER BY a.created_at DESC, COUNT(s.song_id) DESC
		LIMIT 10;`, userID, userID)

    if err != nil {
        http.Error(w, "failed to fetch suggest albums: " + err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var suggestAlbums []models.Album
    for rows.Next() {
        var suggestAlbum models.Album
        err := rows.Scan(&suggestAlbum.AlbumID, &suggestAlbum.Title, &suggestAlbum.ArtistID, &suggestAlbum.Image, &suggestAlbum.CreatedAt)
        if err != nil {
            http.Error(w, "failed to scan suggest album: "+err.Error(), http.StatusInternalServerError)
            return
        }
        suggestAlbums = append(suggestAlbums, suggestAlbum)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over suggest albums: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về lịch sử bài hát dưới dạng JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(suggestAlbums)
}

func GetArtistSuggestByUserID(w http.ResponseWriter, r *http.Request) {
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
			ar.bio,
			ar.image
		FROM artist ar
		JOIN song s ON ar.artist_id = s.artist_id
		JOIN song_genre sg ON s.song_id = sg.song_id
		WHERE sg.genre_id IN (
    		SELECT sg.genre_id
    		FROM favorite_artist fa
    		JOIN artist a ON fa.artist_id = a.artist_id
    		JOIN song s ON a.artist_id = s.artist_id
    		JOIN song_genre sg ON s.song_id = sg.song_id
    		WHERE fa.user_id = ?
		)
		AND ar.artist_id NOT IN (
    		SELECT artist_id
    		FROM favorite_artist
    		WHERE user_id = ?
		)
		GROUP BY ar.artist_id
		ORDER BY COUNT(s.song_id) DESC, ar.created_at DESC
		LIMIT 10;`, userID, userID)

    if err != nil {
        http.Error(w, "failed to fetch suggest artists: " + err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var suggestArtists []models.Artist
    for rows.Next() {
        var suggestArtist models.Artist
        err := rows.Scan(&suggestArtist.ArtistID, &suggestArtist.Name, &suggestArtist.Bio, &suggestArtist.Image)
        if err != nil {
            http.Error(w, "failed to scan suggest artist: "+err.Error(), http.StatusInternalServerError)
            return
        }
        suggestArtists = append(suggestArtists, suggestArtist)
    }

    if err = rows.Err(); err != nil {
        http.Error(w, "failed to iterate over suggest artists: " + err.Error(), http.StatusInternalServerError)
        return
    }

    // Trả về lịch sử bài hát dưới dạng JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(suggestArtists)
}