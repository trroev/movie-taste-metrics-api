const express = require("express");
const router = express.Router();
const passport = require("passport");

const admin_controller = require("../controllers/adminController");

/// ADMIN ROUTES ///

// POST request to login an admin
router.post("/admin/login", admin_controller.login);

// GET request to logout an admin
router.get("/admin/logout", admin_controller.logout);

module.exports = router;
