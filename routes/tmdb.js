const express = require("express");
const router = express.Router();

const tmdb_controller = require("../controllers/tmdbController");

// GET request to retrieve a list of movies
router.get("/movies", tmdb_controller.get_movies);

// GET request to retrieve a specific movie based on id
router.get("/movie/:movieId", tmdb_controller.get_movie);

// GET request to search for a movie
router.get("/movies/search", tmdb_controller.search_movies);

// GET request for a specific tv show based on id
router.get("/tvshow/:showId", tmdb_controller.get_tv_show);

// GET request to search for a tv show
router.get("/tvshows/search", tmdb_controller.search_tv_show);

// GET request for a list of popular actors/directors
router.get("/people", tmdb_controller.get_people);

// GET request for a people search
router.get("/people/search", tmdb_controller.search_people);

// GET request for a list of genres
router.get("/genres", tmdb_controller.get_genres);

module.exports = router;
