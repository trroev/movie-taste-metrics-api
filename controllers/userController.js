const User = require("../models/user");
const Blacklist = require("../models/blacklist");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const logger = require("../config/logger");

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
      res
        .status(200)
        .json({ msg: `${user.username} successfully created` });
    } catch (err) {
      return next(err);
    }
  },
];

// retrieve a specific user by ID
exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ err: `user with id ${req.params.id} no found` });
    }
    // successful, return JSON object of specific user
    res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

// retrieve all users
exports.get_all_users = async (req, res, next) => {
  try {
    const list_users = await User.find()
      .sort([["createdAt", "descending"]])
      .select("-password")
      .exec();

    // successful - return JSON object of all users
    res.status(200).json(list_users);
  } catch (err) {
    return next(err);
  }
};

// update a specific user by ID
exports.update_user = [
  // validate and sanitize fields
  check("username", "username is required")
    .trim()
    .notEmpty()
    .escape(),
  check("email", "email address is required")
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
      // check if the username/email already exists
      const existingUser = await User.findOne({
        $or: [
          { username: req.body.username },
          { email: req.body.email },
        ],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "This username or email already exists" });
      }

      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: {
            ...req.body,
            updatedAt: Date.now(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ err: `user with id ${req.params.id} not found` });
      }
      // successful - return JSON object of the updated user
      res.status(200).json(
        {
          msg: `User with id ${req.params.id} updated successfully`,
        },
        user
      );
    } catch (err) {
      return next(err);
    }
  },
];

// delete_user
exports.delete_user = async (req, res, next) => {
  // check if user owns account or is admin
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(401).json({ err: "Unauthorized" });
  }
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ err: `user with id ${req.params.id} not found` });
    }

    // successful - return JSON message
    res
      .status(200)
      .json({ msg: `${user.username} successfully deleted` });
  } catch (err) {
    return next(err);
  }
};

// change_password
exports.update_password = [
  // validate and sanitize fields
  check("oldPassword", "Old password is required")
    .trim()
    .notEmpty()
    .escape(),
  check("newPassword", "New password is required")
    .trim()
    .notEmpty()
    .escape(),
  check("confirmPassword", "Confirm password is required")
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
      // find user by id
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ err: "User not found" });
      }

      // check if the old password is correct
      if (!user.isValidPassword(req.body.oldPassword)) {
        return res
          .status(400)
          .json({ err: "Incorrect old password" });
      }

      // check if the new password and confirm password match
      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({
          err: "New password does not match confirm password",
        });
      }
      // update users password
      user.set({ password: req.body.newPassword });
      await user.save();

      // successful - return JSON message
      res
        .status(200)
        .json({
          msg: `Password for ${user.username} updated successfully`,
        });
    } catch (err) {
      return next(err);
    }
  },
];

exports.make_admin = [
  // check if user making the request is an admin
  async (req, res, next) => {
    try {
      const currentUser = await User.findById(req.user.id);
      if (!currentUser.isAdmin) {
        return res.status(401).json({ err: "Unauthorized" });
      }
    } catch (err) {
      return next(err);
    }
    next();
  },
  // make the target user an admin
  async (req, res, next) => {
    try {
      // extract the target user's id from the request body
      const targetUserId = req.body.userId;
      // find the target user in the database
      const targetUser = await User.findById(targetUserId);
      // update the target user's isAdmin field to true
      targetUser.isAdmin = true;
      // save the changes to the database
      targetUser.save();
      // successful - return JSON message
      res
        .status(200)
        .json({ msg: `${targetUser.username} granted admin status` });
    } catch (err) {
      return next(err);
    }
  },
];

// login
exports.login = async (req, res, next) => {
  try {
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
  } catch (err) {
    return next(err);
  }
};

// logout
exports.logout = (req, res, next) => {
  try {
    // check if the authorization header is present
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ err: "Authorization header is missing" });
    }
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
