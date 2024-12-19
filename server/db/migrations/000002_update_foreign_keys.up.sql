ALTER TABLE favorite_album
DROP FOREIGN KEY favorite_album_ibfk_1;

ALTER TABLE favorite_album
ADD CONSTRAINT favorite_album_ibfk_1
FOREIGN KEY (user_id) REFERENCES user(user_id)
ON DELETE CASCADE;

ALTER TABLE favorite_artist
DROP FOREIGN KEY favorite_artist_ibfk_1;

ALTER TABLE favorite_artist
ADD CONSTRAINT favorite_artist_ibfk_1
FOREIGN KEY (user_id) REFERENCES user(user_id)
ON DELETE CASCADE;

ALTER TABLE favorite_song
DROP FOREIGN KEY favorite_song_ibfk_1;

ALTER TABLE favorite_song
ADD CONSTRAINT favorite_song_ibfk_1
FOREIGN KEY (user_id) REFERENCES user(user_id)
ON DELETE CASCADE;

ALTER TABLE playlist
DROP FOREIGN KEY playlist_ibfk_1;

ALTER TABLE playlist
ADD CONSTRAINT playlist_ibfk_1
FOREIGN KEY (user_id) REFERENCES user(user_id)
ON DELETE CASCADE;

ALTER TABLE user_song_history
DROP FOREIGN KEY user_song_history_ibfk_1;

ALTER TABLE user_song_history
ADD CONSTRAINT user_song_history_ibfk_1
FOREIGN KEY (user_id) REFERENCES user(user_id)
ON DELETE CASCADE;

ALTER TABLE playlist_song
DROP FOREIGN KEY playlist_song_ibfk_1;

ALTER TABLE playlist_song
ADD CONSTRAINT playlist_song_ibfk_1
FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id)
ON DELETE CASCADE;
