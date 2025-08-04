const { default: mongoose } = require("mongoose");
const passport = require("passport");
const Transcription = require("../models/Transcription");

// Middleware untuk cek apakah user sudah login (JWT)
const isLoggedIn = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token invalid or missing.",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { isLoggedIn };
