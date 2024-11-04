package main

import (
    "log"
    "net/http"
    "music_player/internal/db"
    "music_player/internal/routes"
)

func main() {
    err := db.InitDB("root:dxtruong@tcp(localhost:3306)/music_player")
    if err != nil {
        log.Fatal(err)
    }
    defer db.DB.Close()

    // Đăng ký tất cả các route
    routes.RegisterRoutes()

    log.Println("Server is running on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}
