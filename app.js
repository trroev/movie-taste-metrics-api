require("dotenv").config();
require("./config/db")();
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the Movie Taste Metrics App");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
