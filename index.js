require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");

// Passport config
require("./configs/passport")(passport);

const PORT = process.env.PORT || 5000;

// Init
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

// routes
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/user"));

app.use("/", require("./routes/docs"));

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("--- Server Started ---");
    console.log("MongoDB connection success");
    app.listen(PORT, () => {
      console.log(
        `Server running on: http://${process.env.HOSTNAME}:${process.env.PORT}
Client running on: http://${process.env.CLIENT_URL}`
      );
      console.log("---- Logger ----");
    });
  })
  .catch((err) => {
    console.log("Connection to MongoDB was unsuccessful with error: ", err);
  });
