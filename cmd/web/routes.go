package main

import (
	"github.com/bmizerany/pat"
	"gows-chat/internal/handlers"
	"net/http"
)

func routes() http.Handler {
	mux := pat.New()


	fs := http.FileServer(http.Dir("public/assets/"))
	mux.Get("/static/", http.StripPrefix("/static/", fs))

	mux.Get("/", http.FileServer(http.Dir("./public")))

	mux.Get("/ws", http.HandlerFunc(handlers.WsEndpoint))

	return mux
}
