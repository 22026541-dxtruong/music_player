/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `album`
--

DROP TABLE IF EXISTS `album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album` (
  `album_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `artist_id` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`album_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `album_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album`
--

LOCK TABLES `album` WRITE;
/*!40000 ALTER TABLE `album` DISABLE KEYS */;
INSERT INTO `album` VALUES (1,'Walkerworld',1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqgWVlBcyQzKUFqSjbUpZT4F3wB9GGjGahMbng&s=0','2024-11-04 00:33:05'),(2,'Different World',1,'https://avatar-ex-swe.nixcdn.com/song/2018/11/28/0/3/4/b/1543395088992.jpg','2024-11-04 01:00:40'),(3,'PARALLAX',2,'https://i1.sndcdn.com/artworks-g2Wg5p6mG35yQHQ3-yA0r9Q-t500x500.jpg','2024-11-04 01:08:45'),(4,'Warrior Songs',2,'https://i.scdn.co/image/ab67616d0000b273dc85ffa200d277e11d83473c','2024-11-04 01:10:58'),(5,'Show của Đen',4,'https://i.scdn.co/image/ab67616d0000b2734888abe8ee4d110278a67538','2024-11-04 01:15:15'),(6,'My World 2.0',5,'https://upload.wikimedia.org/wikipedia/en/b/b9/Myworld2.jpg','2024-11-04 01:17:32'),(7,'Changes',5,'https://upload.wikimedia.org/wikipedia/en/1/16/Justin_Bieber_-_Changes.png','2024-11-04 01:18:40'),(8,'Waterloo',7,'https://vinylsaigon.vn/wp-content/uploads/2024/01/waterloo.webp','2024-11-04 01:23:02'),(9,'Arrival',7,'https://upload.wikimedia.org/wikipedia/en/7/71/ABBA_-_Arrival.png','2024-11-04 01:24:52'),(10,'Super Trouper',7,'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/ABBA_-_Super_Trouper_%28Polar%29.jpg/220px-ABBA_-_Super_Trouper_%28Polar%29.jpg','2024-11-04 01:25:51'),(11,'Dangerous',8,'https://upload.wikimedia.org/wikipedia/en/1/11/Michaeljacksondangerous.jpg','2024-11-04 01:27:21'),(12,'Thriller',8,'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png','2024-11-04 01:28:59'),(13,'Bad',8,'https://upload.wikimedia.org/wikipedia/en/5/51/Michael_Jackson_-_Bad.png','2024-11-04 01:30:18'),(14,'Marshmello Fortnite Extended Set',9,'https://upload.wikimedia.org/wikipedia/en/0/0a/Marshmello_Fortnite_Extended_Set.png','2024-11-04 01:32:35'),(15,"Let\'s Talk About Love",10,'https://www.diathan.com/wp-content/uploads/2013/10/E-ModernTalking-032b-e1466761496119.jpg','2024-11-04 01:37:04'),(16,'Back for Good',10,'https://vinylsaigon.vn/wp-content/uploads/2022/10/backforgood.webp','2024-11-04 01:39:28'),(17,'The Best of Boney M.',11,'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Boney_M._-_The_Best_Of.jpg/220px-Boney_M._-_The_Best_Of.jpg','2024-11-04 01:45:01'),(18,'Nightflight to Venus',11,'https://m.media-amazon.com/images/I/91qruEGHoRL._UF1000,1000_QL80_.jpg','2024-11-04 01:47:42');
/*!40000 ALTER TABLE `album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artist`
--

DROP TABLE IF EXISTS `artist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artist` (
  `artist_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artist`
--

LOCK TABLES `artist` WRITE;
/*!40000 ALTER TABLE `artist` DISABLE KEYS */;
INSERT INTO `artist` VALUES (1,'Alan Walker','Alan Walker là nhà sản xuất âm nhạc và DJ người Na Uy, sinh ngày 24 tháng 8 năm 1997. Anh nổi tiếng với bản hit \"Faded\" phát hành năm 2015, kết hợp giữa nhạc điện tử, pop và dance. Phong cách của anh thường gắn liền với hình ảnh đeo mặt nạ và áo hoodie. Ngoài \"Faded,\" các bài hát nổi bật khác bao gồm \"Alone\" và \"Darkside.\" Alan Walker được coi là một trong những tài năng trẻ hàng đầu trong ngành âm nhạc hiện đại.','2024-11-03 07:30:46','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKrTyfA8s5UtzgveqDBTqfj1TlGFVVVGqJ20n-i8rvycvCM_WdTugmEda-HA&s=10'),(2,'TheFatRat','TheFatRat, tên thật là Christian Büttner, là nhà sản xuất âm nhạc người Đức, sinh ngày 3 tháng 6 năm 1995. Anh nổi tiếng với những bản nhạc điện tử vui tươi như \"Unity,\" \"The Calling,\" và \"Monody.\" Âm nhạc của TheFatRat thường kết hợp EDM và orchestral elements, và anh được yêu thích trong cộng đồng game và YouTube.','2024-11-03 07:36:45','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr8-Ic0WAn2TjmMEHxKXrQyi1GwPt-VegbB1v3glwMBA&s=10&quot;);'),(3,'Sơn Tùng M-TP','Sơn Tùng M-TP, tên thật là Nguyễn Thanh Tùng, sinh ngày 5 tháng 7 năm 1994, là một ca sĩ, nhạc sĩ và nhà sản xuất âm nhạc nổi tiếng Việt Nam. Anh được biết đến với các bản hit như \"Cơn Mưa Ngang Qua,\" \"Chạy Ngay Đi,\" và \"Lạc Trôi.\" Sơn Tùng nổi bật với phong cách âm nhạc hiện đại và hình ảnh cá tính, trở thành một trong những ngôi sao hàng đầu trong làng nhạc Việt.','2024-11-03 07:36:45','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRljLuBpPSfxpWWyz4gby3GqDvqoRNMvjqyPx24qNEF7Q&s=10&quot'),(4,'Đen Vâu','Đen Vâu, tên thật là Nguyễn Đình Hải, sinh ngày 13 tháng 5 năm 1991, là một rapper và nhạc sĩ nổi tiếng Việt Nam. Anh được biết đến với phong cách rap mộc mạc, lời ca sâu sắc và các bản hit như \"Bài Này Chill Phết,\" \"Đố Em Biết,\" và \"Làm Người Tử Tế.\" Đen Vâu đã ghi dấu ấn mạnh mẽ trong làng nhạc Việt với khả năng kết hợp nhạc hip-hop và các yếu tố dân gian.','2024-11-03 07:36:45','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAFyzWG0em0csaJb7VaAch2WuGJ04jYL8mkpeICi5qZQ&s=10&quot'),(5,'Justin Beiber','Justin Bieber, sinh ngày 1 tháng 3 năm 1994, là một ca sĩ và nhạc sĩ người Canada. Anh nổi tiếng từ năm 2009 với hit \"Baby\" và nhanh chóng trở thành một trong những nghệ sĩ hàng đầu thế giới. Bieber đã phát hành nhiều album thành công, bao gồm \"Purpose\" và \"Changes,\" với các bản hit như \"Sorry,\" \"Love Yourself,\" và \"Peaches.\" Anh được biết đến với phong cách âm nhạc đa dạng và ảnh hưởng mạnh mẽ đến văn hóa pop.','2024-11-03 07:36:45','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKjTDegakG80RWK-lvq_ynsHd-taNRzRgYilW0SxrrM8A6Jk_EfUsuNmaNCg&s=10&quot'),(7,'ABBA','ABBA là ban nhạc pop Thụy Điển nổi tiếng, thành lập năm 1972, gồm bốn thành viên: Agnetha, Björn, Benny và Anni-Frid. Họ nổi bật với các hit như \"Dancing Queen\" và \"Mamma Mia,\" trở thành một trong những ban nhạc thành công nhất mọi thời đại. ABBA tan rã năm 1982 nhưng tái hợp vào năm 2021 với album \"Voyage.\"','2024-11-03 07:50:11','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUqNZ-sugtsRR2WtFhCkhODWdH11FgIHEHlNPzuCr812WgiOB1BRPE4iylcw&s=10&quot'),(8,'Michael Jackson','Michael Jackson, sinh ngày 29 tháng 8 năm 1958, là một ca sĩ, nhạc sĩ và vũ công người Mỹ, được xem là \"Vua của nhạc pop.\" Ông nổi tiếng với những bản hit như \"Billie Jean,\" \"Thriller,\" và \"Beat It.\" Jackson có ảnh hưởng sâu rộng đến âm nhạc, văn hóa và phong cách nghệ thuật, với các vũ điệu đặc trưng như \"moonwalk.\" Ông đã giành nhiều giải thưởng, bao gồm 13 giải Grammy, và được nhớ đến như một trong những nghệ sĩ vĩ đại nhất mọi thời đại.','2024-11-03 07:50:11','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2moWQZkgkx7VmOw13I63QrHqmVkwT9i1nyMPMae33aXEC5sJk_q1DudoZ9Q&s=10&quot'),(9,'Marshmello','Marshmello, tên thật là Christopher Comstock, sinh ngày 19 tháng 5 năm 1992, là một DJ và nhà sản xuất âm nhạc người Mỹ. Ông nổi tiếng với phong cách âm nhạc EDM và các bản hit như \"Alone,\" \"Happier,\" và \"Friends.\" Marshmello được biết đến với hình ảnh đặc trưng là chiếc mũ bảo hiểm hình khối kẹo marshmallow, tạo nên thương hiệu độc đáo và thu hút nhiều fan hâm mộ trên toàn thế giới.\n\n\n\n','2024-11-03 07:50:11','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRdRJymcGJfzzFl-AzXYhj-vjEIn6NYBFxkxr_Z6JNLbNH1ZvsEIVGyQ68uA&s=10&quot'),(10,'Modern Talking',"Modern Talking là một bộ đôi nhạc pop Đức, gồm Thomas Anders và Dieter Bohlen, thành lập vào năm 1984. Nhóm nổi tiếng với các bản hit như \"You\'re My Heart, You\'re My Soul\" và \"Cheri Cheri Lady,\" kết hợp giữa âm nhạc dance và pop. Modern Talking nhanh chóng trở thành một trong những nhóm nhạc thành công nhất châu Âu trong thập niên 1980, với hàng triệu album được tiêu thụ. Họ tan rã vào năm 1987 nhưng tái hợp vào năm 1998 và tiếp tục phát hành nhiều sản phẩm âm nhạc.",'2024-11-03 07:50:11','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCpvGgBiLdrIRjCLS4tHfK26IftlmOpXiTVoMEfypm8qUhBfYaGfM_0ONSMA&s=10&quot'),(11,'Boney M.','Boney M. là một nhóm nhạc disco nổi tiếng, thành lập vào năm 1976, gồm bốn thành viên: Frank Farian, Liz Mitchell, Marcia Barrett và Maizie Williams. Nhóm nổi bật với các bản hit như \"Rivers of Babylon,\" \"Daddy Cool,\" và \"Sunny.\" Âm nhạc của Boney M. kết hợp giữa disco, reggae và pop, giúp họ trở thành một trong những nhóm nhạc thành công nhất thập niên 1970 và 1980. Họ đã bán triệu bản album trên toàn thế giới và vẫn được yêu thích cho đến nay.','2024-11-03 07:50:11','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkydywUFwIPRHTn963HGxplWtHLxtc1W76LeQTlgUvYA&s=10&quot');
/*!40000 ALTER TABLE `artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_album`
--

DROP TABLE IF EXISTS `favorite_album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_album` (
  `user_id` int NOT NULL,
  `album_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`album_id`),
  KEY `album_id` (`album_id`),
  CONSTRAINT `favorite_album_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ,
  CONSTRAINT `favorite_album_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_album`
--

LOCK TABLES `favorite_album` WRITE;
/*!40000 ALTER TABLE `favorite_album` DISABLE KEYS */;
INSERT INTO `favorite_album` VALUES (5,1),(5,2);
/*!40000 ALTER TABLE `favorite_album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_artist`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_artist` (
  `user_id` int NOT NULL,
  `artist_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`artist_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `favorite_artist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `favorite_artist_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_artist`
--

LOCK TABLES `favorite_artist` WRITE;
/*!40000 ALTER TABLE `favorite_artist` DISABLE KEYS */;
INSERT INTO `favorite_artist` VALUES (5,1),(5,11);
/*!40000 ALTER TABLE `favorite_artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_song`
--

DROP TABLE IF EXISTS `favorite_song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_song` (
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `favorite_song_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `favorite_song_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_song`
--

LOCK TABLES `favorite_song` WRITE;
/*!40000 ALTER TABLE `favorite_song` DISABLE KEYS */;
INSERT INTO `favorite_song` VALUES (5,1),(5,2),(5,5),(5,35),(5,39);
/*!40000 ALTER TABLE `favorite_song` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (1,'EDM','Nhạc điện tử (Electronic Dance Music) chủ yếu dành cho các buổi tiệc, lễ hội và câu lạc bộ. Âm nhạc này thường có nhịp điệu nhanh, bass mạnh mẽ và sử dụng nhiều âm thanh điện tử, tạo ra không gian sôi động.','https://www.ikmultimedia.com/products/stedm/main-banner/mobile.jpg'),(2,'Pop','Nhạc dễ nghe, dễ tiếp cận với giai điệu đơn giản, bắt tai và lời ca dễ nhớ. Đây là thể loại nhạc phổ biến nhất, thường xuyên được phát trên đài phát thanh và TV.','https://cdn.vectorstock.com/i/1000v/77/09/colorful-detailed-pop-music-can-vector-19847709.jpg'),(3,'Hip-Hop','Nhạc có nguồn gốc từ văn hóa đường phố, đặc trưng bởi lời rap nhanh và beat mạnh mẽ. Hip-hop không chỉ là âm nhạc mà còn là một phong trào văn hóa, ảnh hưởng mạnh mẽ tới các thế hệ trẻ.','https://img.freepik.com/premium-vector/graffiti-cartoon-illustrations-vibrant-colors-street-art-hiphop-graffiti-character-design_675911-368.jpg?semt=ais_hybrid'),(4,'Rock','Nhạc mạnh mẽ, chủ yếu sử dụng guitar điện, bass và trống. Đây là thể loại nhạc có sự tự do sáng tác lớn, với các biến thể từ nhẹ nhàng (soft rock) đến mạnh mẽ (hard rock).','https://media.istockphoto.com/id/1183921035/vector/rock-sign-gesture-with-lightning-for-your-design.jpg?s=612x612&w=0&k=20&c=4r6LcLz2IQ_NBQ__YsSoy9rANKTvxwm-Bnw6lfoYNfM='),(5,'Disco','Nhạc sôi động, vui tươi, thường có nhịp điệu dễ nhảy và phù hợp với các bữa tiệc. Disco phổ biến vào những năm 1970, và cho đến nay vẫn rất được ưa chuộng trong các không gian khiêu vũ.','https://static2.bigstockphoto.com/2/7/4/large1500/4721151.jpg'),(6,'Funk','Nhạc với nhịp điệu nhấn mạnh vào bass và guitar, tạo ra cảm giác vui tươi và năng động. Funk có ảnh hưởng sâu sắc đến các thể loại nhạc hiện đại như R&B và hip-hop.','https://i.pinimg.com/474x/6c/73/f8/6c73f8d9409d1893ccd3f57d65e51da0.jpg'),(7,'Dance Pop','Sự kết hợp giữa pop và các yếu tố điện tử, tạo ra những bản nhạc sôi động, dễ nhảy và dễ nghe. Đây là thể loại nhạc dành cho các bữa tiệc và lễ hội.','https://i1.sndcdn.com/artworks-4S4ajvlHRhtVlbOM-NKc7Rw-t500x500.jpg'),(8,'Eurodance','Thể loại nhạc điện tử từ châu Âu, kết hợp với pop và house, nổi bật với nhịp điệu nhanh và âm thanh mạnh mẽ. Eurodance thường xuyên được sử dụng trong các sự kiện và câu lạc bộ.','https://www.musiconvinyl.com/cdn/shop/files/MOVLP3720__Sleeve.webp?v=1714545273'),(9,'Eurobeat','Nhạc điện tử châu Âu với nhịp điệu cực nhanh, mang lại cảm giác phấn khích. Thường được nghe trong các lễ hội, cuộc thi đua xe và các sự kiện khiêu vũ.','https://i.scdn.co/image/ab67616d0000b273f06f0b54dde93f2b8612be3f'),(10,'World Music','Nhạc mang âm hưởng dân gian và truyền thống từ các nền văn hóa khác nhau. Thể loại này kết hợp các nhạc cụ truyền thống và các yếu tố âm nhạc hiện đại để tạo nên những bản nhạc đa văn hóa.','https://img.freepik.com/free-vector/hand-drawn-background-world-music-day-celebration_23-2150388979.jpg?semt=ais_hybrid'),(11,'Reggae','Nhạc có nguồn gốc từ Jamaica, nổi bật với nhịp điệu nhẹ nhàng và thông điệp hòa bình. Reggae thường mang tính xã hội và chính trị, với các lời ca ca ngợi tình yêu và sự hòa hợp.','https://www.shutterstock.com/image-photo/imagine-me-where-reggae-cartoon-260nw-2480098027.jpg'),(12,'Trap','Một biến thể của hip-hop, với bass mạnh và nhịp điệu không đối xứng. Trap thường có yếu tố điện tử, tạo ra âm thanh tối và u ám, thích hợp cho những bản nhạc nặng và mạnh mẽ.','https://i1.sndcdn.com/artworks-GKIJ5kUYCBVS5tUO-dAwR9w-t500x500.jpg'),(13,'Holiday','Nhạc lễ hội, thường nghe vào dịp Giáng Sinh hoặc các kỳ nghỉ lễ khác. Các bài hát này mang không khí ấm áp, vui tươi và thường có chủ đề về gia đình, tình yêu và niềm vui mùa lễ hội.','https://www.dailynews.com/wp-content/uploads/2024/11/iStock-479145970.jpg?w=1024');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist`
--

DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `playlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`playlist_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist`
--

LOCK TABLES `playlist` WRITE;
/*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
INSERT INTO `playlist` VALUES (36,5,'Ok','2024-12-07 11:47:35'),(37,5,'Hi','2024-12-07 11:49:09'),(38,5,'Cut','2024-12-07 13:18:45'),(54,5,'A','2024-12-09 00:37:01'),(55,5,'Go','2024-12-11 07:54:39');
/*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_song`
--

DROP TABLE IF EXISTS `playlist_song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist_song` (
  `playlist_id` int NOT NULL,
  `song_id` int NOT NULL,
  PRIMARY KEY (`playlist_id`,`song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `playlist_song_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`playlist_id`),
  CONSTRAINT `playlist_song_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_song`
--

LOCK TABLES `playlist_song` WRITE;
/*!40000 ALTER TABLE `playlist_song` DISABLE KEYS */;
INSERT INTO `playlist_song` VALUES (36,1),(37,1),(38,5),(54,5),(55,5),(54,6),(36,35),(37,35),(38,35);
/*!40000 ALTER TABLE `playlist_song` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `song`
--

DROP TABLE IF EXISTS `song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `song` (
  `song_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `album_id` int DEFAULT NULL,
  `artist_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` varchar(255) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`song_id`),
  KEY `album_id` (`album_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `song_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`),
  CONSTRAINT `song_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `song`
--

LOCK TABLES `song` WRITE;
/*!40000 ALTER TABLE `song` DISABLE KEYS */;
INSERT INTO `song` VALUES (1,'Lengends Never Die',1,1,'2024-11-03 08:14:09','LegendsNeverDie-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRusMPZVk05fug8DDGntJ8EIeTTpi6kw7JumULw&s=0'),(2,'Faded',2,1,'2024-11-03 08:23:27','Faded-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2U5iS-a28TpmSaBczti6PF59w3yu9Cw41y7zH&s=0'),(3,'Alone',2,1,'2024-11-03 08:23:27','Alone-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOziN2tIX1LLL_-SeX0sj79S7UuMRrX2i9aya&s=0'),(4,'Unity',1,1,'2024-11-03 08:23:27','Unity-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqQ87vFz4Q77mhf1pJd3_AVRVuJGg6vmYELHwj&s=0'),(5,'LiLy',2,1,'2024-11-03 08:23:27','Lily-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYx3Ks54yN1-KFFrDc3ZfAIVwGN-ehv1DlMoBI&s=0'),(6,'All Falls Down',2,1,'2024-11-03 08:23:27','AllFallsDown-AlanWalker.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVsk170Ajte70QvgAyO7Yw0TwdfPO7wHfNR9iA&s=0'),(7,'Fly Away',4,2,'2024-11-03 08:32:45','FlyAway-TheFatRat.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR11ukz8f7Y-O1o1807GFgdFXUsTlsmRuKs6iYI&s=0'),(8,'Unity',3,2,'2024-11-03 08:32:45','Unity-TheFatRat.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1qaxTNS6VKx98ugL6_Kn5cxR-atCzMG5C9FrE&s=0'),(9,'Stronger',3,2,'2024-11-03 08:32:45','Stronger-TheFatRat.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgT92NM777cjRWNisx_jrfagz2SLiAVTN3ubTP&s=0'),(10,'Origin',4,2,'2024-11-03 08:32:45','Origin-TheFatRat.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpSnucdrJDviW8WTKOJlaLXTH9PnXw3iPRkPM9&s=0'),(11,'Hiding In The Blue',3,2,'2024-11-03 08:32:45','HidingInTheBlue-TheFatRat.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR4RW2okrU9FjEanmsXS5s1WzQL2tm25JQSxbJ&s=0'),(12,'Monody',3,2,'2024-11-03 08:34:48','Monody-TheFatRat.mp3','https://avatar-ex-swe.nixcdn.com/song/2017/11/01/8/9/5/4/1509514275012_500.jpg'),(13,'Hãy trao cho anh',NULL,3,'2024-11-03 08:44:14','HayTraoChoAnh-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVBDrun0OUbTFEiRWb2Y4-jVbS6tRCCznWYs98&s=0'),(14,'Lạc trôi',NULL,3,'2024-11-03 08:44:14','LacTroi-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuKuZobqomUEdOB3GlnOlCe6WydpRdRhyJaOp7&s=0'),(15,'Chúng ta của hiện tại',NULL,3,'2024-11-03 08:44:14','ChungTaCuaHienTai-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx6NWcNykSkxF2gGWKZQvH-vDz8e7SW_M8ssAcOQ&s=0'),(16,'Anh sai rồi',NULL,3,'2024-11-03 08:44:14','AnhSaiRoi-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW-65zGs5iqntDQ1r_N41GteanIWcKlNQp6gpo&s=0'),(17,'Buông đôi tay nhau ra',NULL,3,'2024-11-03 08:44:14','BuongDoiTayNhauRa-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuf2Fb5YYs7sxbYSr1G66UQ3HBsMsNRuJIBqvu&s=0'),(18,'Nắng ấm xa dần',NULL,3,'2024-11-03 08:44:14','NangAmXaDan-SonTungMTP.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwRYkZd3P3e6V_Bd5m7rTtKRCYSa9eMhDgV1Wl&s=0'),(19,'Đưa nhau đi trốn',5,4,'2024-11-03 08:54:45','DuaNhauDiTron-DenVau.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpMA8Gq3wJsZwXVbJYqsPYnOrVZ69iAQtRuAnP&s=0'),(20,'Baby',6,5,'2024-11-03 08:54:45','Baby-JustinBieber.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMHAy8xJB-tG9_sSsXmSy6BvaKg00a6FWDW_5R&s=0'),(21,'Yummy',7,5,'2024-11-03 08:54:45','Yummy-JustinBieber.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQebH7YLuYD7Xt35WfhEGnBAgLqgcf3TCSqojGa&s=0'),(28,'Happy New Year',10,7,'2024-11-03 09:00:24','HappyNewYear-ABBA.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7H_3ZAwe6JvUpX3lQmwjwKYDuIb95U3Cl5ZYJ2sRZTRTpP5Z6fio&s=0'),(29,'Money, Money, Money',9,7,'2024-11-03 09:00:24','MoneyMoneyMoney-ABBA.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO8TED13Hg_lwnqfAr3Q1fFbHjDb6ecSG3kqob&s=0'),(30,'Ring Ring',8,7,'2024-11-03 09:00:24','RingRing-ABBA.mp3','https://avatar-ex-swe.nixcdn.com/song/2015/12/18/8/1/9/8/1450412807689_500.jpg'),(31,'Beat it',12,8,'2024-11-03 09:06:07','BeatIt-MichaelJackson.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8OsLhmi14I8HU6vrM7lmKAd9OPBm4NYAoxtXL&s=0'),(32,'Smooth Criminal',13,8,'2024-11-03 09:06:07','Smoothcriminal-MichaelJackson.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnplU2rg94SypcfFgg4rPQ2Mi5odRKdTUAp4Sq&s=0'),(33,'Bad',13,8,'2024-11-03 09:06:07','Bad-MichaelJackson.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAkE1GHMvDlQp0sOzacjRx6vI3x3A-mqKKuVIH&s=0'),(34,'Dangerous',11,8,'2024-11-03 09:06:07','Dangerous-MichaelJackson.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ07l3AmkxWYRShKzN7Fg5--CZirIKszL4jV0isJohbzFdDz-1OiYX&s=0'),(35,'Alone',14,9,'2024-11-03 09:08:49','Alone-Marshmello.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOjlWl1dYurOq-0T_ISTJqM5HlS9Y0Q95foHp3&s=0'),(36,'Happier',14,9,'2024-11-03 09:08:49','Happier-Marshmello.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmgwPD78hpV7M0wvF10Q9yeo1PkMgnGLFplWAW&s=0'),(37,'Chei Cheri Lady',15,10,'2024-11-03 09:20:32','ChariChariLady-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2mAe-NytIX2EqJ61AK9mQ9OVSZ97-vG-SJV9Ltx28KrUJ3mqdaUii&s=0'),(38,'You\'re my heart you\'re my soul',16,10,'2024-11-03 09:20:32','YourMyHeartYourMySoul-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFCKZUWmfmx6Ml1Jm6AQywOmXdbgbsz8MEPJQz&s=0'),(39,'Brother Louie',16,10,'2024-11-03 09:20:32','BrotherLouie-MordenTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAmQSWpVfOdBB7Pxddgi86UXGl6XmYU_4O0B3yd4IuxbcLg3v6Kth&s=0'),(40,'Do You Wanna',16,10,'2024-11-03 09:20:32','DoYouWanna-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnHgIc6bix2WwGof2l-xmi0vE9Berlt8_HC9Yu&s=0'),(41,'No Face No Name No Number',16,10,'2024-11-03 09:20:32','NoFaceNoNameNoNumber-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPMkCpamMnRIbrDlmFprTOB3f-W6ErCZ_-Exah&s=0'),(42,'Sexy Sexy Lover',16,10,'2024-11-03 09:20:32','SexySexyLover-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBg1a7yXeZ2c8D6qDTCFbB-38_jTr2-bcXAsmH&s=0'),(43,'Atlantis Is Calling',16,10,'2024-11-03 09:20:32','AtlantisIsCalling-ModernTalking.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0BGY_U9yTG3-Z6ydI_3xiRO3Ift1O5jy3Ds_R&s=0'),(44,'Rasputin',17,11,'2024-11-03 09:32:00','Rasputin-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_ZzQetQwaN_qhjgvxFC3D4v2AyvzLRLNQWk-h&s=0'),(45,'Daddy Cool',17,11,'2024-11-03 09:32:00','DaddyCool-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRceZXJnZrm_ao_UQ7-tP5Ncnm9q49H_GQyE4kO&s=0'),(46,'Brown Girl in the Ring',18,11,'2024-11-03 09:32:00','BrownGirlInTheRing-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxb5FaaKpjWOPtZdYjV7Ej-55p1dJIB9Dpenzi&s=0'),(47,'Hooray Hooray Its A Holi-Holiday',17,11,'2024-11-03 09:32:00','HoorayHoorayItsAHoli-Holiday-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmfFT3oM-mjW1F11Fr5uYnbPYucNTvvdKTgSPD&s=0'),(48,'Ma Baker',17,11,'2024-11-03 09:32:00','MaBaker-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnsKHV9o4eXlQISegA9IpiX15C5A4-ADzkGHrQ&s=0'),(49,'Rivers Of Babylon',17,11,'2024-11-03 09:32:00','RiverOfBabylonRemix-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSplBr-8o6EfXEH7LjfoANO-pFgcNevZfwlcz6u&s=0'),(50,'Sunny',17,11,'2024-11-03 09:39:47','Sunny-BoneyM.mp3','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT_Re00YMjXB7eSopN6jTnHu8MoPe66AR4PaG7&s=0');
/*!40000 ALTER TABLE `song` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `song_genre`
--

DROP TABLE IF EXISTS `song_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `song_genre` (
  `song_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`song_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `song_genre_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`),
  CONSTRAINT `song_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `song_genre`
--

LOCK TABLES `song_genre` WRITE;
/*!40000 ALTER TABLE `song_genre` DISABLE KEYS */;
INSERT INTO `song_genre` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(19,1),(36,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(36,2),(40,2),(41,2),(46,2),(49,2),(9,3),(1,4),(31,4),(32,4),(33,4),(34,4),(41,4),(28,5),(29,5),(30,5),(44,5),(45,5),(46,5),(47,5),(48,5),(50,5),(31,6),(32,6),(33,6),(34,6),(50,6),(13,7),(19,7),(20,7),(21,7),(37,7),(39,7),(40,7),(42,7),(43,7),(4,8),(10,8),(37,8),(39,8),(42,8),(43,8),(44,9),(45,9),(48,9),(49,11),(14,12),(28,13),(47,13);
/*!40000 ALTER TABLE `song_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (5,'Hello','dxtruong2511@gmail.com','$2a$10$dz94rqkjyuRvs4wNwdliOevQJXiqDBlTgl85dtTz8KntQ1abdGWBi','2024-11-12 02:09:55');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_song_history`
--

DROP TABLE IF EXISTS `user_song_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_song_history` (
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `last_played` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `play_count` int DEFAULT '1',
  PRIMARY KEY (`user_id`,`song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `user_song_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `user_song_history_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `song` (`song_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_song_history`
--

LOCK TABLES `user_song_history` WRITE;
/*!40000 ALTER TABLE `user_song_history` DISABLE KEYS */;
INSERT INTO `user_song_history` VALUES (5,1,'2024-12-17 06:21:08',5),(5,5,'2024-12-17 06:17:03',2),(5,35,'2024-12-17 03:50:49',3),(5,37,'2024-12-17 03:50:01',2),(5,40,'2024-12-11 07:56:17',1),(5,41,'2024-12-17 03:49:55',3),(5,42,'2024-12-17 06:21:14',3),(5,44,'2024-12-17 06:21:18',1),(5,50,'2024-12-17 03:50:35',2);
/*!40000 ALTER TABLE `user_song_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
