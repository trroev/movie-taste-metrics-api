const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

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
  isAdmin: {
    type: Boolean,
    default: false,
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

// hash plain text password before save
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

// compare hashed password
UserSchema.methods.isValidPassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

UserSchema.virtual("post_date_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

module.exports = mongoose.model("User", UserSchema);
