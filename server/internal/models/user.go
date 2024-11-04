package models

type User struct {
    UserID    int    `json:"user_id"`
    Username  string `json:"username"`
    Email     string `json:"email"`
    Password  string `json:"password"`
    CreatedAt string `json:"created_at"`
}
