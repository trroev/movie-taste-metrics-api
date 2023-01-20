const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/userController");

/// USER ROUTES ///

// POST request to create a new user
router.post("/user/signup", user_controller.create_user);

// GET request to find a specific user by id
router.get("/user/:id", user_controller.get_user);

// POST request to login a user
router.post("/user/login", user_controller.login);

// GET request to logout a user
router.get("/user/logout", user_controller.logout);

module.exports = router;
