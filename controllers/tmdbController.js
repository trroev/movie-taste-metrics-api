const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const handleError = (err, res, next) => {
  // check for specific error types and respond accordingly
  if (err.response && err.response.status === 400) {
    return res.status(400).send("Error: Bad request");
  }
  if (err.response && err.response.status === 401) {
    return res.status(401).send("Error: Unauthorized");
  }
  if (err.response & (err.response.status === 403)) {
    return res
      .status(403)
      .send(
        "Forbidden: you do not have access to the requested resource"
      );
  }
  if (err.response && err.response.status === 404) {
    return res.status(404).send("Error: Resource not found");
  }
  if (err.response && err.response.status === 500) {
    return res.status(500).send("Error: Internal server error");
  }
  if (err.response && err.response.status === 503) {
    return res.status(503).send("Error: Service unavailable");
  }
  // handle any other errors
  return next(err);
};

// retrieve a list of popular movies from TMDb
exports.get_movies = async (req, res, next) => {
  try {
    // make a GET request to the TMDb API
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
    );
    // extract the data from the resonse
    const movies = response.data.results;
    // return the list of movies to the client
    res.status(200).json(movies);
  } catch (err) {
    handleError(err, res, next);
  }
};

// retrieve a specific movie based on its id
exports.get_movie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    const movie = response.data;
    res.status(200).json(movie);
  } catch (err) {
    handleError(err, res, next);
  }
};

// search for a specific movie
exports.search_movies = async (req, res, next) => {
  try {
    const { title } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}`
    );
    // extract the data from the response
    const movies = response.data.results;
    // return the list of movies to the client
    res.status(200).json(movies);
  } catch (err) {
    handleError(err, res, next);
  }
};

// retrieve a tv show by id
exports.get_tv_show = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${showId}?api_key=${TMDB_API_KEY}`
    );
    const tvShow = response.data;
    res.status(200).json(tvShow);
  } catch (err) {
    handleError(err, res, next);
  }
};

// search for a specific tv show
exports.search_tv_show = async (req, res, next) => {
  try {
    const { title } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${title}`
    );
    const shows = response.data.results;
    res.status(200).json(shows);
  } catch (err) {
    handleError(err, res, next);
  }
};

// retrieve a list of popular actors/directors
exports.get_people = async (req, res, next) => {
  try {
    // make a GET request to the TMDb API
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}`
    );
    // extract the data from the resonse
    const people = response.data.results;
    // return the list of people to the client
    res.status(200).json(people);
  } catch (err) {
    handleError(err, res, next);
  }
};

// search for a specific person
exports.search_people = async (req, res, next) => {
  try {
    const { name } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${name}`
    );
    // extract the data from the response
    const person = response.data.results;
    // return the list of people to the client
    res.status(200).json(person);
  } catch (err) {
    handleError(err, res, next);
  }
};

// retrieve a list of genres
exports.get_genres = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
    );

    const genres = response.data.genres;
    res.status(200).json(genres);
  } catch (err) {
    handleError(err, res, next);
  }
};
