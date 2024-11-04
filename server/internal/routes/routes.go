package routes

import (
    "net/http"
    "music_player/internal/handlers"
)

func RegisterRoutes() {
	//GET http://localhost:8080/users
    http.HandleFunc("/users", handlers.GetUsers)
	//GET http://localhost:8080/users?user_id=1
	http.HandleFunc("/users/by_id", handlers.GetUserByID)

	//GET http://localhost:8080/artists
    http.HandleFunc("/artists", handlers.GetArtists)
	//GET http://localhost:8080/artists?artist_id=1
	http.HandleFunc("/artists/by_id", handlers.GetArtistByID)

	//GET http://localhost:8080/albums
    http.HandleFunc("/albums", handlers.GetAlbums)
	//GET http://localhost:8080/albums?album_id=1
	http.HandleFunc("/albums/by_id", handlers.GetAlbumByID)
    //GET http://localhost:8080/albums/by_artist?artist_id=1
    http.HandleFunc("/albums/by_artist", handlers.GetAlbumsByArtistId)

	//GET http://localhost:8080/songs
    http.HandleFunc("/songs", handlers.GetSongs)
    //GET http://localhost:8080/songs/by_artist?artist_id=1
    http.HandleFunc("/songs/by_artist", handlers.GetSongsByArtistId)
    //GET http://localhost:8080/songs/by_id?song_id=1
    http.HandleFunc("/songs/by_id", handlers.GetSongByID)
	//GET http://localhost:8080/songs?genre_id=1
	http.HandleFunc("/songs/by_genre", handlers.GetSongsByGenre)
	//GET http://localhost:8080/songs?album_id=1
	http.HandleFunc("/songs/by_album", handlers.GetSongsByAlbum)
	//GET http://localhost:8080/songs?playlist_id=1
	http.HandleFunc("/songs/by_playlist", handlers.GetSongsByPlaylist)

	//GET http://localhost:8080/playlists
    http.HandleFunc("/playlists", handlers.GetPlaylists)
	//GET http://localhost:8080/playlists?user_id=1
	http.HandleFunc("/playlists/by_user", handlers.GetPlaylistsByUserID)
	//GET http://localhost:8080/playlists?playlist_id=1
	http.HandleFunc("/playlists/by_id", handlers.GetPlaylistByID)
	//POST http://localhost:8080/playlists/songs/add
	http.HandleFunc("/playlists/songs/add", handlers.AddSongToPlaylist)
	//POST http://localhost:8080/playlists/create
	http.HandleFunc("/playlists/create", handlers.CreatePlaylist)

	//POST http://localhost:8080/favorites/artists/add
    http.HandleFunc("/favorites/artists/add", handlers.AddFavoriteArtistByUserID)
	//POST http://localhost:8080/favorites/songs/add
    http.HandleFunc("/favorites/songs/add", handlers.AddFavoriteSongByUserID)
	//POST http://localhost:8080/favorites/albums/add
	http.HandleFunc("/favorites/albums/add", handlers.AddFavoriteAlbumByUserID)
	//GET http://localhost:8080/favorites/albums
	http.HandleFunc("/favorites/albums", handlers.GetFavoriteAlbumsByUserID)
	//GET http://localhost:8080/favorites/artists
    http.HandleFunc("/favorites/artists", handlers.GetFavoriteArtistsByUserID)
	//GET http://localhost:8080/favorites/songs
    http.HandleFunc("/favorites/songs", handlers.GetFavoriteSongsByUserID)

	//GET http://localhost:8080/genres
	http.HandleFunc("/genres", handlers.GetGenres)

	//GET http://localhost:8080/search/artists?query=John
	http.HandleFunc("/search/artists", handlers.SearchArtists)
	//GET http://localhost:8080/search/albums?query=Love
    http.HandleFunc("/search/albums", handlers.SearchAlbums)
	//GET http://localhost:8080/search/songs/album?album_id=1&query=Summer
    http.HandleFunc("/search/songs/album", handlers.SearchSongsInAlbum)
	//GET http://localhost:8080/search/songs/playlist?playlist_id=2&query=Happy
    http.HandleFunc("/search/songs/playlist", handlers.SearchSongsInPlaylist)
	//GET http://localhost:8080/search/songs/genre?genre_id=1&query=love
	http.HandleFunc("/search/songs/genre", handlers.SearchSongsInGenre)
}
