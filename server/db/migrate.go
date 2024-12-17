package main

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	// Load các biến môi trường từ file .env
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
	migrationsPath := "file://db/migrations"

	// Chuỗi kết nối database
	dsn := fmt.Sprintf("mysql://%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	// Chạy migrations
	m, err := migrate.New(migrationsPath, dsn)
	if err != nil {
		log.Fatalf("Could not initialize migrate instance: %v", err)
	}

	// Kiểm tra và xử lý dirty version
	version, dirty, err := m.Version()
	if err != nil {
		log.Fatalf("Failed to get current migration version: %v", err)
	}
	if dirty {
		if err := m.Force(int(version)); err != nil {
			log.Fatalf("Failed to force migration to version %d: %v", version, err)
		}
		log.Println("Forced migration to fix dirty state.")
	}

	// Chạy migrations
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("Migrations ran successfully or no changes were found.")
}
