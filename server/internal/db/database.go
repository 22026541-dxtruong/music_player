package db

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

// InitDB khởi tạo kết nối đến database
func InitDB(dataSourceName string) error {
	var err error
	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		return err
	}

	// Ping để kiểm tra kết nối
	if err = DB.Ping(); err != nil {
		return err
	}

	log.Println("Database connection established successfully!")
	return nil
}
