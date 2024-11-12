package routes

import (
    "net/http"
    "music_player/internal/handlers"
)

func RegisterRoutes() {
    // POST /register
    http.HandleFunc("/register", handlers.Register)
    // POST /login
    http.HandleFunc("/login", handlers.Login)

	//GET /users
    http.HandleFunc("/users", handlers.GetUsers)
	//GET /users?user_id=1
	http.HandleFunc("/users/by_id", handlers.GetUserByID)

	//GET /artists
    http.HandleFunc("/artists", handlers.GetArtists)
	//GET /artists?artist_id=1
	http.HandleFunc("/artists/by_id", handlers.GetArtistByID)

	//GET /albums
    http.HandleFunc("/albums", handlers.GetAlbums)
	//GET /albums?album_id=1
	http.HandleFunc("/albums/by_id", handlers.GetAlbumByID)
    //GET /albums/by_artist?artist_id=1
    http.HandleFunc("/albums/by_artist", handlers.GetAlbumsByArtistId)

	//GET /songs
    http.HandleFunc("/songs", handlers.GetSongs)
    //GET /songs/by_artist?artist_id=1
    http.HandleFunc("/songs/by_artist", handlers.GetSongsByArtistId)
    //GET /songs/by_id?song_id=1
    http.HandleFunc("/songs/by_id", handlers.GetSongByID)
	//GET /songs?genre_id=1
	http.HandleFunc("/songs/by_genre", handlers.GetSongsByGenre)
	//GET /songs?album_id=1
	http.HandleFunc("/songs/by_album", handlers.GetSongsByAlbum)
	//GET /songs?playlist_id=1
	http.HandleFunc("/songs/by_playlist", handlers.GetSongsByPlaylist)

	//GET /playlists
    http.HandleFunc("/playlists", handlers.GetPlaylists)
	//GET /playlists?user_id=1
	http.HandleFunc("/playlists/by_user", handlers.GetPlaylistsByUserID)
	//GET /playlists?playlist_id=1
	http.HandleFunc("/playlists/by_id", handlers.GetPlaylistByID)
	//POST /playlists/songs/add
	http.HandleFunc("/playlists/songs/add", handlers.AddSongToPlaylist)
	//POST /playlists/create
	http.HandleFunc("/playlists/create", handlers.CreatePlaylist)

	//POST /favorites/artists/add
    http.HandleFunc("/favorites/artists/add", handlers.AddFavoriteArtistByUserID)
	//POST /favorites/songs/add
    http.HandleFunc("/favorites/songs/add", handlers.AddFavoriteSongByUserID)
	//POST /favorites/albums/add
	http.HandleFunc("/favorites/albums/add", handlers.AddFavoriteAlbumByUserID)
	//GET /favorites/albums
	http.HandleFunc("/favorites/albums", handlers.GetFavoriteAlbumsByUserID)
	//GET /favorites/artists
    http.HandleFunc("/favorites/artists", handlers.GetFavoriteArtistsByUserID)
	//GET /favorites/songs
    http.HandleFunc("/favorites/songs", handlers.GetFavoriteSongsByUserID)

	//GET /genres
	http.HandleFunc("/genres", handlers.GetGenres)
	//GET /genres?genre_id=1
	http.HandleFunc("/genres/by_id", handlers.GetGenreById)

    //GET /search?query=love
    http.HandleFunc("/search", handlers.SearchAll)
	//GET /search/artists?query=John
	http.HandleFunc("/search/artists", handlers.SearchArtists)
	//GET /search/albums?query=Love
    http.HandleFunc("/search/albums", handlers.SearchAlbums)
    //GET /search/songs?query=love
    http.HandleFunc("/search/songs", handlers.SearchSongs)
	//GET /search/songs/album?album_id=1&query=Summer
    http.HandleFunc("/search/songs/album", handlers.SearchSongsInAlbum)
	//GET /search/songs/playlist?playlist_id=2&query=Happy
    http.HandleFunc("/search/songs/playlist", handlers.SearchSongsInPlaylist)
	//GET /search/songs/genre?genre_id=1&query=love
	http.HandleFunc("/search/songs/genre", handlers.SearchSongsInGenre)
}
