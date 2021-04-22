package main

import (
	"gows-chat/internal/handlers"
	"log"
	"net/http"
)

func main() {
	mux := routes()

	log.Println("Staring channel listener")
	go handlers.ListenToWsChanel()

	log.Println("Starting web server on port 8080")

	_ = http.ListenAndServe(":8080", mux)
}
