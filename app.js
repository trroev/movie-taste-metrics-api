require("dotenv").config();
require("./config/db")();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const winston = require("winston");

// import routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const tmdbRouter = require("./routes/tmdb");

const app = express();

// set up logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
  ],
});

// set up middleware
app.use(cors());
app.use(express.json());

// initialize passport and use it in the app
app.use(passport.initialize());
require("./config/passport")(passport);

// set up routes
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/api/tmdb", tmdbRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
