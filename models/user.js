const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteFilms: [
    {
      type: String,
    },
  ],
  favoriteActors: [
    {
      type: String,
    },
  ],
  favoriteDirectors: [
    {
      type: String,
    },
  ],
  favoriteGenres: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
