# Music Player Project

## Yêu cầu

- Go (phiên bản mới nhất)
- MySQL server đã được cài đặt và đang chạy

## Hướng dẫn cài đặt

1. Clone dự án về máy của bạn:
    ```bash
    git clone https://github.com/22026541-dxtruong/music_player.git
    cd music_player/server
    ```

2. Cài đặt các gói cần thiết:
    ```bash
    go mod tidy
    ```
   
3. Các biến trong file `.env`:
   ```bash
   DB_USER=your_db_user           # Tên người dùng MySQL. Ví dụ: root
   DB_PASSWORD=your_db_password   # Mật khẩu của người dùng MySQL.
   DB_HOST=localhost              # Địa chỉ host MySQL, thường là localhost nếu MySQL đang chạy trên máy local.
   DB_PORT=3306                   # Cổng kết nối MySQL, mặc định là 3306.
   DB_NAME=music_player           # Tên cơ sở dữ liệu bạn muốn sử dụng, ví dụ: music_player.
   PORT=8080                      # Cổng mà server sẽ chạy (ví dụ: 8080).
   API_HOST=http://192.168.1.100  # Địa chỉ IP hoặc URL của máy chủ API, ví dụ: http://192.168.1.100.
   ```

4. Chạy migration để tạo cơ sở dữ liệu và bảng:
    ```bash
    go run db/migrate.go
    ```

5. Chạy ứng dụng:
    ```bash
    go run cmd/main.go
    ```
