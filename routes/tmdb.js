const express = require("express");
const router = express.Router();

const tmdb_controller = require("../controllers/tmdbController");

router.get("/movies", tmdb_controller.get_movies);

router.get("/search", tmdb_controller.search_movies);

module.exports = router;
