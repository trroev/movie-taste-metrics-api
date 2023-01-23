const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/userController");

// POST request to create a new user
router.post("/signup", user_controller.create_user);

// GET request to find a specific user by id
router.get("/:id", user_controller.get_user);

// GET request to find all users
router.get("/users", user_controller.get_all_users);

// PUT request to update a specific user by id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_user
);

// PUT reques to update a specific users password
router.put(
  "/:id/update_password",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_password
);

// POST request to delete a specific user by id
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  user_controller.delete_user
);

// POST request to login a user
router.post("/login", user_controller.login);

// GET request to logout a user
router.get("/logout", user_controller.logout);

module.exports = router;
