const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to the Movie Taste Metrics App");
});

module.exports = router;
