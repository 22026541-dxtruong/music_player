package main

import (
	"fmt"
	"log"
	"music_player/internal/db"
	"music_player/internal/routes"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Truy cập các biến môi trường
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")
    port := os.Getenv("PORT")

    dbConnectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)
	err = db.InitDB(dbConnectionString)
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
    defer db.DB.Close()
    
    http.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("public"))))

    // Đăng ký tất cả các route
    routes.RegisterRoutes()

    log.Println("Server is running on :" + port)
    if err := http.ListenAndServe(":" + port, nil); err != nil {
        log.Fatal(err)
    }
}
