package db

import (
    "database/sql"
    _ "github.com/go-sql-driver/mysql" // Driver MySQL
)

var DB *sql.DB

func InitDB(dataSourceName string) error {
    var err error
    DB, err = sql.Open("mysql", dataSourceName)
    if err != nil {
        return err
    }
    return DB.Ping()
}
