const express = require("express");
const router = express.Router();

const tmdb_controller = require("../controllers/tmdbController");

// retrieve a list of movies
router.get("/movies", tmdb_controller.get_movies);

// retrieve a specific movie based on id
router.get("/movie", tmdb_controller.get_movie);

// search for a movie
router.get("/search", tmdb_controller.search_movies);

module.exports = router;
