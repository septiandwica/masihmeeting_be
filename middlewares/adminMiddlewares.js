// Middleware untuk cek apakah user adalah admin
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Akses ditolak, hanya admin yang bisa mengakses.",
  });
};

module.exports = { checkAdmin };
