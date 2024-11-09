package models

type SearchResultItem struct {
    Type string      `json:"type"`
    Data interface{} `json:"data"`
}