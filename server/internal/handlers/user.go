package handlers

import (
    "encoding/json"
    "net/http"
    "music_player/internal/models"
    "music_player/internal/db"
	"strconv"
	"database/sql"
)

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

