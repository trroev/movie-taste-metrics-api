require("dotenv").config();
require("./config/db")();
const express = require("express");
const passport = require("passport");
const cors = require("cors");

// import routes
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();

// set up middleware
app.use(cors());
app.use(express.json());

// initialize passport and use it in the app
app.use(passport.initialize());
require("./config/passport")(passport);

// set up routes
app.use("/", indexRouter);
app.use("/", apiRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
