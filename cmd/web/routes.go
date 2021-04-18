package main

import (
	"github.com/bmizerany/pat"
	"net/http"
)

func routes() http.Handler {
	mux := pat.New()

	mux.Get("/", http.FileServer(http.Dir("./public")))

	return mux
}
