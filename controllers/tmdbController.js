const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;

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

exports.get_movie = async (req, res, next) => {
  try {
    const { movieId } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    const movie = response.data;
    res.status(200).json(movie);
  } catch (err) {
    return next(err);
  }
};

exports.search_movies = async (req, res, next) => {
  try {
    const { title } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie/?api_key=${TMDB_API_KEY}&query=${title}`
    );
    // extract the data from the response
    const movies = response.data.results;
    // return the list of movies to the client
    res.status(200).json(movies);
  } catch (err) {
    return next(err);
  }
};
