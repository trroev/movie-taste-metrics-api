const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;

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
    return next(err);
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
    return next(err);
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
    return next(err);
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
    return next(err);
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
    return next(err);
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
    return next(err);
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
    return next(err);
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
    return next(err);
  }
};
