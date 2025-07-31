const express = require("express");
const router = express.Router();

/**
 * @route   GET /
 * @desc    Halaman dokumentasi API
 * @access  Public
 */
router.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Documentation</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; line-height: 1.6; }
          h1 { color: #4f46e5; }
          code { background: #f1f1f1; padding: 2px 4px; border-radius: 4px; }
          .endpoint { margin-bottom: 1.5rem; }
        </style>
      </head>
      <body>
        <h1>MasihMeeting API Documentation</h1>

        <h2>Auth Routes</h2>
        <div class="endpoint">
          <strong>POST</strong> <code>/auth/register</code><br />
          Register user baru.
        </div>
        <div class="endpoint">
          <strong>POST</strong> <code>/auth/login</code><br />
          Login user.
        </div>
        <div class="endpoint">
          <strong>GET</strong> <code>/auth/profile</code><br />
          Mendapatkan profile user yang sedang login. <em>(auth required)</em>
        </div>
        <div class="endpoint">
          <strong>GET</strong> <code>/auth/google</code><br />
          Login via Google.
        </div>
        <div class="endpoint">
          <strong>GET</strong> <code>/auth/verify/:token</code><br />
          Verifikasi email user.
        </div>

        <h2>User Routes</h2>
        <div class="endpoint">
          <strong>GET</strong> <code>/users</code><br />
          Mendapatkan semua user. <em>(admin only)</em>
        </div>
        <div class="endpoint">
          <strong>GET</strong> <code>/users/:id</code><br />
          Mendapatkan detail user berdasarkan ID. <em>(admin or owner)</em>
        </div>
        <div class="endpoint">
          <strong>PUT</strong> <code>/users/:id</code><br />
          Update data user. <em>(admin or owner)</em>
        </div>
        <div class="endpoint">
          <strong>DELETE</strong> <code>/users/:id</code><br />
          Hapus user. <em>(admin only)</em>
        </div>

        <hr />
        <p>Semua endpoint menggunakan JSON sebagai format request dan response.</p>
      </body>
    </html>
  `);
});

module.exports = router;
