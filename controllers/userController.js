const User = require("../models/user");
const Blacklist = require("../models/blacklist");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// create a user and save it to the database
exports.create_user = [
  // validate and sanitize fields
  check("username", "username is required")
    .trim()
    .notEmpty()
    .escape(),
  check("email", "email address is required")
    .trim()
    .notEmpty()
    .escape(),
  check("password", "password is required")
    .trim()
    .notEmpty()
    .escape(),
  // process request after validation and sanitization
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // extract the user data from the request body
      const { username, email, password } = req.body;
      // check if the username/email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "This username or email already exists" });
      }
      // create a new User object with the escaped and trimmed data
      const user = new User({ username, email, password });

      // save the User to the database
      user.save();
      // successful - return the created user to the client
      res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
];

exports.login = async (req, res, next) => {
  // extract the username and password from the request body
  const { username, password } = req.body;

  // find the user by their username
  const user = await User.findOne({ username });
  if (!user)
    return res.status(401).json({ error: "Invalid username" });

  // compare the provided password with the hashed password stored in the database
  const isMatch = await user.isValidPassword(password);
  if (!isMatch)
    return res.status(401).json({ error: "Invalid password" });

  // create a JSON web token
  const payload = { userId: user._id };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  // return the token to the client
  res.status(200).json({ msg: "Login successful", token });
};

exports.logout = (req, res, next) => {
  try {
    // get the jwt from the headers
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY);
    const decoded = jwt.decode(token);
    const expiresAt = decoded.exp;

    // invalidate the token by making it blacklisted
    Blacklist.create({ token, expiresAt });

    // successful - return a JSON message indicating the logout was a success
    res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return next(err);
  }
};
