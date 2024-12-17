package handlers

import (
	"encoding/json"
	"music_player/internal/db"
	"music_player/internal/models"
	"music_player/internal/utils"
	"net/http"
	"sort"
)

func SearchAll(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query().Get("query")
    searchType := r.URL.Query().Get("type")  // Lấy tham số 'type' từ query
    if query == "" {
        http.Error(w, "query is required", http.StatusBadRequest)
        return
    }

    var searchResults []models.SearchResultItem

    // Nếu type không có giá trị, tìm kiếm tất cả các loại (artist, album, song)
    if searchType == "" || searchType == "artist" {
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
    }

    if searchType == "" || searchType == "album" {
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
    }

    if searchType == "" || searchType == "song" {
        // Tìm kiếm song và thêm vào kết quả
        rowsSongs, err := db.DB.Query("SELECT song_id, title, album_id, artist_id, duration, created_at, file_path, image FROM song WHERE title LIKE ? ORDER BY title ASC", "%"+query+"%")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rowsSongs.Close()

        api := utils.GetAPIUrlAndPort()
        for rowsSongs.Next() {
            var song models.Song
            if err := rowsSongs.Scan(&song.SongID, &song.Title, &song.AlbumID, &song.ArtistID, &song.Duration, &song.CreatedAt, &song.FilePath, &song.Image); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            song.FilePath = api + song.FilePath
            searchResults = append(searchResults, models.SearchResultItem{
                Type: "song",
                Data: song,
            })
        }
    }

    if searchType == "playlist" {
        rowsPlaylists, err := db.DB.Query("SELECT playlist_id, user_id, name FROM playlist WHERE name LIKE ? ORDER BY name ASC", "%"+query+"%")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rowsPlaylists.Close()

        for rowsPlaylists.Next() {
            var playlist models.Playlist
            if err := rowsPlaylists.Scan(&playlist.PlaylistID, &playlist.UserID, &playlist.Name); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            searchResults = append(searchResults, models.SearchResultItem{
                Type: "playlist",
                Data: playlist,
            })
        }
    }

    // Sắp xếp tất cả các kết quả theo tên hoặc title
    if searchType == "" {
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
    }

    // Trả về kết quả
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(searchResults)
}

