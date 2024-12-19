package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	// Định nghĩa flags
	rollback := flag.Bool("rollback", false, "Rollback migrations")
	steps := flag.String("steps", "1", "Number of steps to rollback (default: 1)")
	force := flag.Int("force", -1, "Force database to specific migration version (default: no force)")
	showVersion := flag.Bool("version", false, "Display current migration version")

	flag.Parse()

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

	// Khởi tạo migrate instance
	m, err := migrate.New(migrationsPath, dsn)
	if err != nil {
		log.Fatalf("Could not initialize migrate instance: %v", err)
	}

	// Kiểm tra trạng thái dirty
	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		log.Fatalf("Failed to get current migration version: %v", err)
	}

	if dirty {
		log.Printf("Database is in a dirty state at version %d. Fixing...", version)
		if err := m.Force(int(version)); err != nil {
			log.Fatalf("Failed to force migration to version %d: %v", version, err)
		}
		log.Println("Forced migration to clean state.")
	}

	// Xem phiên bản hiện tại
	if *showVersion {
		if err == migrate.ErrNilVersion {
			log.Println("No migrations applied yet.")
		} else {
			log.Printf("Current migration version: %d (dirty: %v)", version, dirty)
		}
		return
	}

	// Thực hiện rollback nếu flag rollback được bật
	if *rollback {
		rollbackSteps, err := strconv.Atoi(*steps)
		if err != nil {
			log.Fatalf("Invalid value for steps: %v", err)
		}

		log.Printf("Rolling back %d step(s)...", rollbackSteps)
		err = m.Steps(-rollbackSteps)
		if err != nil {
			log.Fatalf("Rollback failed: %v", err)
		}
		log.Println("Rollback completed successfully.")
		return
	}

	// Thực hiện force đến phiên bản được chỉ định
	if *force >= 0 {
		log.Printf("Forcing migration to version %d...", *force)
		err = m.Force(*force)
		if err != nil {
			log.Fatalf("Force migration failed: %v", err)
		}
		log.Printf("Migration forced to version %d successfully.", *force)
		return
	}

	// Chạy migrations thông thường
	log.Println("Applying migrations...")
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("Migrations ran successfully or no changes were found.")
}
