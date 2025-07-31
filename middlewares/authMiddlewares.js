const passport = require("passport");

// Middleware untuk cek apakah user sudah login (JWT)
const isLoggedIn = passport.authenticate("jwt", { session: false });

module.exports = { isLoggedIn };
