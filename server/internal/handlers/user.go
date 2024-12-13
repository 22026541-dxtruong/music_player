package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"music_player/internal/db"
	"music_player/internal/models"
	"net/http"
	"strconv"

	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Decode the request body to get login details
	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user models.User

	// Query for the user by email
	query := `SELECT user_id, username, email, password FROM user WHERE email = ?`
	err = db.DB.QueryRow(query, loginRequest.Email).Scan(&user.UserID, &user.Username, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusUnauthorized)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	// Compare the hashed password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	response := map[string]interface{}{
		"user_id":  user.UserID,
		"username": user.Username,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func Register(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
        return
    }

    var newUser struct {
        Username string `json:"username"`
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    err := json.NewDecoder(r.Body).Decode(&newUser)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Kiểm tra xem email đã được đăng ký chưa
    var existingUser models.User
    query := `SELECT user_id, username, email FROM user WHERE email = ?`
    err = db.DB.QueryRow(query, newUser.Email).Scan(&existingUser.UserID, &existingUser.Username, &existingUser.Email)

    if err == nil {
        // Nếu không có lỗi thì email đã tồn tại
        http.Error(w, "Email already registered", http.StatusBadRequest)
        return
    }

    // Kiểm tra lỗi khác (ngoài việc không tìm thấy kết quả)
    if err != nil && err.Error() != "sql: no rows in result set" {
        http.Error(w, "Error checking email", http.StatusInternalServerError)
        return
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Error hashing password", http.StatusInternalServerError)
        return
    }
    newUser.Password = string(hashedPassword)

    // Chèn người dùng mới vào cơ sở dữ liệu
    query = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`
    _, err = db.DB.Exec(query, newUser.Username, newUser.Email, newUser.Password)
    if err != nil {
        http.Error(w, "Error saving user to the database", http.StatusInternalServerError)
        return
    }

    // Truy vấn lại để lấy thông tin người dùng vừa thêm vào
    var user models.User
    query = `SELECT user_id, username FROM user WHERE email = ?`
    err = db.DB.QueryRow(query, newUser.Email).Scan(&user.UserID, &user.Username)
    if err != nil {
        http.Error(w, "Error retrieving user ID", http.StatusInternalServerError)
        return
    }

    // Trả về thông tin user
    response := map[string]interface{}{
        "user_id":  user.UserID,
        "username": user.Username,
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(response)
}

func DeleteAccount(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	// Lấy user_id từ query string
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

	// Kiểm tra xem user có tồn tại không
	var exists bool
	err = db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM user WHERE user_id = ?)", userID).Scan(&exists)
	if err != nil {
		fmt.Printf("Error checking user existence: %v", err)
		http.Error(w, "Error checking user existence", http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Xóa user từ database
	_, err = db.DB.Exec("DELETE FROM user WHERE user_id = ?", userID)
	if err != nil {
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	// Phản hồi thành công
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	response := map[string]string{"message": "User deleted successfully"}
	json.NewEncoder(w).Encode(response)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query("SELECT user_id, username, email, created_at FROM user")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.UserID, &user.Username, &user.Email, &user.CreatedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUserByID(w http.ResponseWriter, r *http.Request) {
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

	var user models.User // Đảm bảo bạn đã định nghĩa model User đúng cách
	err = db.DB.QueryRow("SELECT user_id, username, email, created_at FROM user WHERE user_id = ?", userID).Scan(&user.UserID, &user.Username, &user.Email, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "user not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
