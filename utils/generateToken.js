// utils/generateToken.js
/**
 * Generate JWT token for a user
 * @param {Object} user - User object (must include _id)
 * @returns {string} JWT token
 */

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
