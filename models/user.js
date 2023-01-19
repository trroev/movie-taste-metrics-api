const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const UserSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
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

UserSchema.virtual("post_date_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("User", UserSchema);
