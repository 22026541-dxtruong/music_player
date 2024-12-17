package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetAPIUrlAndPort() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiUrl := os.Getenv("API_URL")
	port := os.Getenv("PORT")
	return apiUrl + ":" + port + "/public/"
}