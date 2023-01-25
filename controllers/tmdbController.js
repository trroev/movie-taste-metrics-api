const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const logger = require("winston");

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
    logger.info(
      "get_movies - Successfully returned a list of popular movies."
    );
  } catch (err) {
    logger.error(
      "get_movies - Failed to return a list of popular movies."
    );
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
    logger.info(
      "get_movie - Successfully returned a specific movie using it's ID."
    );
  } catch (err) {
    logger.error(
      "get_movie - Failed to return a specific movie using it's ID."
    );
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
    logger.info(
      "search_movies - Successfully returned a movie or list of movies using a query."
    );
  } catch (err) {
    logger.error(
      "search_movies - Failed to return a movie or list of movies using a query."
    );
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
    logger.info(
      "get_tv_show - Successfully returned a tv show using it's ID."
    );
  } catch (err) {
    logger.error(
      "get_tv_show - Failed to return a tv show using it's ID."
    );
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
    logger.info(
      "search_tv_show - Successfully returned a tv show or list of tv shows using a query."
    );
  } catch (err) {
    logger.error(
      "search_tv_show - Failed to return a tv show or list of tv shows using a query."
    );
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
    logger.info(
      "get_people - Successfully returned a list of popular actors/directors."
    );
  } catch (err) {
    logger.error(
      "get_people - Failed to return a list of popular actors/directors."
    );
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
    logger.info(
      "search_people - Successfully returned a person or list of people using a query."
    );
  } catch (err) {
    logger.error(
      "search_people - Failed to return a person or list of people using a query."
    );
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
    logger.info(
      "get_genres - Successfully returned a list of genres."
    );
  } catch (err) {
    logger.error("get_genres - Failed to return a list of genres");
    handleError(err, res, next);
  }
};
