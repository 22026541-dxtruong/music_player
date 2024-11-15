package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
    "sort"
	"strconv"
)

func SearchArtists(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    if query == "" {
        http.Error(w, "query is required", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query("SELECT artist_id, name, image FROM artist WHERE name LIKE ?", "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var artists []models.Artist
    for rows.Next() {
        var artist models.Artist
        if err := rows.Scan(&artist.ArtistID, &artist.Name, &artist.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        artists = append(artists, artist)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(artists)
}

func SearchAlbums(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    if query == "" {
        http.Error(w, "query is required", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query("SELECT album_id, title, artist_id, image FROM album WHERE title LIKE ?", "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var albums []models.Album
    for rows.Next() {
        var album models.Album
        if err := rows.Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        albums = append(albums, album)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(albums)
}

func SearchSongs(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    if query == "" {
        http.Error(w, "query is required", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query("SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image FROM song WHERE title LIKE ?", "%"+query+"%")
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

func SearchSongsInAlbum(w http.ResponseWriter, r *http.Request) {
    albumIDStr := r.URL.Query().Get("album_id")
    query := r.URL.Query().Get("query")

    if albumIDStr == "" || query == "" {
        http.Error(w, "album_id and query are required", http.StatusBadRequest)
        return
    }

    albumID, err := strconv.Atoi(albumIDStr)
    if err != nil {
        http.Error(w, "invalid album_id", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query("SELECT song_id, title FROM song WHERE album_id = ? AND title LIKE ?", albumID, "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func SearchSongsInPlaylist(w http.ResponseWriter, r *http.Request) {
    playlistIDStr := r.URL.Query().Get("playlist_id")
    query := r.URL.Query().Get("query")

    if playlistIDStr == "" || query == "" {
        http.Error(w, "playlist_id and query are required", http.StatusBadRequest)
        return
    }

    playlistID, err := strconv.Atoi(playlistIDStr)
    if err != nil {
        http.Error(w, "invalid playlist_id", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query(`
        SELECT s.song_id, s.title 
        FROM song s
        JOIN playlist_song ps ON s.song_id = ps.song_id
        WHERE ps.playlist_id = ? AND s.title LIKE ?`, playlistID, "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func SearchSongsInGenre(w http.ResponseWriter, r *http.Request) {
    genreIDStr := r.URL.Query().Get("genre_id")
    query := r.URL.Query().Get("query")

    if genreIDStr == "" || query == "" {
        http.Error(w, "genre_id and query are required", http.StatusBadRequest)
        return
    }

    genreID, err := strconv.Atoi(genreIDStr)
    if err != nil {
        http.Error(w, "invalid genre_id", http.StatusBadRequest)
        return
    }

    rows, err := db.DB.Query(`
        SELECT s.song_id, s.title, s.album_id, s.artist_id, s.duration, s.created_at, s.file_path 
        FROM song s
        JOIN song_genre sg ON s.song_id = sg.song_id
        WHERE sg.genre_id = ? AND s.title LIKE ?`, genreID, "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var songs []models.Song
    for rows.Next() {
        var song models.Song
        if err := rows.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        songs = append(songs, song)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(songs)
}

func SearchAll(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    if query == "" {
        http.Error(w, "query is required", http.StatusBadRequest)
        return
    }

    var searchResults []models.SearchResultItem

    // Tìm kiếm artist và thêm vào kết quả
    rowsArtists, err := db.DB.Query("SELECT artist_id, name, image FROM artist WHERE name LIKE ? ORDER BY name ASC", "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rowsArtists.Close()

    for rowsArtists.Next() {
        var artist models.Artist
        if err := rowsArtists.Scan(&artist.ArtistID, &artist.Name, &artist.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        searchResults = append(searchResults, models.SearchResultItem{
            Type: "artist",
            Data: artist,
        })
    }

    // Tìm kiếm album và thêm vào kết quả
    rowsAlbums, err := db.DB.Query("SELECT album_id, title, artist_id, image FROM album WHERE title LIKE ? ORDER BY title ASC", "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rowsAlbums.Close()

    for rowsAlbums.Next() {
        var album models.Album
        if err := rowsAlbums.Scan(&album.AlbumID, &album.Title, &album.ArtistID, &album.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        searchResults = append(searchResults, models.SearchResultItem{
            Type: "album",
            Data: album,
        })
    }

    // Tìm kiếm song và thêm vào kết quả
    rowsSongs, err := db.DB.Query("SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image FROM song WHERE title LIKE ? ORDER BY title ASC", "%"+query+"%")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rowsSongs.Close()

    for rowsSongs.Next() {
        var song models.Song
        if err := rowsSongs.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        searchResults = append(searchResults, models.SearchResultItem{
            Type: "song",
            Data: song,
        })
    }

    // Sắp xếp tất cả các kết quả theo tên hoặc title
    sort.Slice(searchResults, func(i, j int) bool {
        var iTitle, jTitle string
        // Kiểm tra loại đối tượng và lấy field cần so sánh
        switch v := searchResults[i].Data.(type) {
        case models.Artist:
            iTitle = v.Name
        case models.Album:
            iTitle = v.Title
        case models.Song:
            iTitle = v.Title
        }
        switch v := searchResults[j].Data.(type) {
        case models.Artist:
            jTitle = v.Name
        case models.Album:
            jTitle = v.Title
        case models.Song:
            jTitle = v.Title
        }
        return iTitle < jTitle // So sánh theo thứ tự bảng chữ cái
    })

    // Trả về kết quả
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(searchResults)
}

