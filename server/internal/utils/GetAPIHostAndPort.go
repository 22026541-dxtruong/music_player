package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetAPIHostAndPort() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiHost := os.Getenv("API_HOST")
	port := os.Getenv("PORT")
	return apiHost + ":" + port + "/public/"
}