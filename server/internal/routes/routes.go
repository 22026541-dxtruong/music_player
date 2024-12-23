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
    // DELETE /delete
    http.HandleFunc("/delete", handlers.DeleteAccount)
	// POST /change-password
	// http.HandleFunc("/change-password", handlers.ChangePassword)

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
    //GET /songs/by_id?song_id=1&user_id=1
    http.HandleFunc("/songs/by_id", handlers.GetSongByID)
	//GET /songs?genre_id=1
	http.HandleFunc("/songs/by_genre", handlers.GetSongsByGenre)
	//GET /songs?album_id=1
	http.HandleFunc("/songs/by_album", handlers.GetSongsByAlbum)
	//GET /songs?playlist_id=1
	http.HandleFunc("/songs/by_playlist", handlers.GetSongsByPlaylist)
	//GET /songs/history?user_id=1
	http.HandleFunc("/songs/history", handlers.GetUserSongHistory)
	//DELETE
	http.HandleFunc("/songs/history/delete", handlers.DeleteSongHistory)


	//GET /playlists
    http.HandleFunc("/playlists", handlers.GetPlaylists)
	//GET /playlists?user_id=1
	http.HandleFunc("/playlists/by_user", handlers.GetPlaylistsByUserID)
	//GET /playlists?playlist_id=1
	http.HandleFunc("/playlists/by_id", handlers.GetPlaylistByID)
	//POST /playlists/songs/add
	http.HandleFunc("/playlists/songs/add", handlers.AddSongToPlaylists)
	//POST /playlists/create
	http.HandleFunc("/playlists/create", handlers.CreatePlaylist)
	//GET /playlists/songs?playlist_id=1
	http.HandleFunc("/playlists/songs", handlers.GetSongsByPlaylistID)
	//DELETE /playlists/delete
	http.HandleFunc("/playlists/delete", handlers.DeletePlaylistByID)
	//DELETE /playlists/songs/delete
	http.HandleFunc("/playlists/songs/delete", handlers.DeleteSongInPlaylist)

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
    //DELETE
    http.HandleFunc("/favorites/artists/delete", handlers.DeleteFavoriteArtistByUserID)
    http.HandleFunc("/favorites/songs/delete", handlers.DeleteFavoriteSongByUserID)
    http.HandleFunc("/favorites/albums/delete", handlers.DeleteFavoriteAlbumByUserID)

	//GET /genres
	http.HandleFunc("/genres", handlers.GetGenres)
	//GET /genres?genre_id=1
	http.HandleFunc("/genres/by_id", handlers.GetGenreById)

    //GET /search?query=love
    http.HandleFunc("/search", handlers.SearchAll)

	//GET /hotsongs
	http.HandleFunc("/hotsongs", handlers.GetSongTrend)
	//GET /suggest/songs
	http.HandleFunc("/suggest/songs", handlers.GetSongSuggestByUserID)
	//GET /suggest/albums
	http.HandleFunc("/suggest/albums", handlers.GetAlbumSuggestByUserID)
	//GET /suggest/artists
	http.HandleFunc("/suggest/artists", handlers.GetArtistSuggestByUserID)
}
