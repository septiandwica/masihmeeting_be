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
        <title>MasihMeeting API Docs</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; color: #333; }
          h1 { color: #4f46e5; }
          code { background: #eee; padding: 2px 6px; border-radius: 4px; }
          .endpoint { margin-bottom: 2rem; padding: 1rem; background: #fff; border-left: 4px solid #4f46e5; box-shadow: 0 0 3px rgba(0,0,0,0.1); }
          pre { background: #f1f1f1; padding: 1rem; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>📘 MasihMeeting API Documentation</h1>

        <h2>🔐 Auth Routes</h2>

        <div class="endpoint">
          <h3>POST /auth/register</h3>
          <p>Register user baru</p>
          <strong>Request Body:</strong>
          <pre>{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "password123"
}</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "User berhasil dibuat. Silakan cek email untuk verifikasi.",
  "user": {
    "id": "xxx",
    "email": "budi@example.com",
    "name": "Budi",
    "role": "user"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>POST /auth/login</h3>
          <p>Login dan mendapatkan token JWT</p>
          <strong>Request Body:</strong>
          <pre>{
  "email": "budi@example.com",
  "password": "password123"
}</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Login berhasil",
  "token": "jwt-token",
  "user": {
    "id": "xxx",
    "email": "budi@example.com",
    "name": "Budi",
    "role": "user",
    "isVerified": "true",
    "authType": "local",
    "avatar": ""
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>GET /auth/profile</h3>
          <p>Mendapatkan profil user yang sedang login</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "user": {
    "id": "xxx",
    "name": "Budi",
    "email": "budi@example.com",
    "role": "user"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>GET /auth/verify/:token</h3>
          <p>Verifikasi email dari token</p>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Email berhasil diverifikasi."
}</pre>
        </div>

        <h2>👥 User Routes</h2>

        <div class="endpoint">
          <h3>GET /users</h3>
          <p>Ambil semua user (Admin only)</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;admin_token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "users": [
    {
      "id": "xxx",
      "name": "Budi",
      "email": "budi@example.com",
      "role": "user"
    }
  ]
}</pre>
        </div>

        <div class="endpoint">
          <h3>GET /users/:id</h3>
          <p>Ambil detail user (Admin atau user itu sendiri)</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "user": {
    "id": "xxx",
    "name": "Budi",
    "email": "budi@example.com",
    "role": "user"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>PUT /users/:id</h3>
          <p>Update user (Admin atau user itu sendiri)</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Request Body:</strong>
          <pre>{
  "name": "Budi Update",
  "email": "budi@baru.com"
}</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "User berhasil diupdate",
  "user": {
    "id": "xxx",
    "name": "Budi Update",
    "email": "budi@baru.com",
    "role": "user"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>DELETE /users/:id</h3>
          <p>Hapus user (Admin only)</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;admin_token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "User berhasil dihapus"
}</pre>
        </div>


        <h2>📝 Transcription Routes</h2>

        <div class="endpoint">
          <h3>POST /transcribe/youtube</h3>
          <p>Transkrip video YouTube ke teks dan simpan ke database</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Request Body:</strong>
          <pre>{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Transkripsi berhasil disimpan",
  "data": {
    "_id": "xxx",
    "transcription": "Isi transkrip...",
    "summary": "Ringkasan isi...",
    "duration": 123.45,
    "type": "youtube",
    "title": "Judul Video"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>POST /transcribe/audio</h3>
          <p>Upload file audio untuk ditranskripsi</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Form-Data:</strong>
          <ul>
            <li><code>file</code>: file audio (.mp3, .wav, dll)</li>
          </ul>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Transkripsi audio berhasil disimpan",
  "data": {
    "_id": "xxx",
    "transcription": "Isi transkrip...",
    "summary": "Ringkasan isi...",
    "duration": 45.2,
    "type": "audio",
    "originalSource": "file"
  }
}</pre>
        </div>

        <div class="endpoint">
          <h3>POST /transcribe/video</h3>
          <p>Upload file video untuk ditranskripsi</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Form-Data:</strong>
          <ul>
            <li><code>file</code>: file video (.mp4, .mov, dll)</li>
          </ul>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Transkripsi video berhasil disimpan",
  "data": {
    "_id": "xxx",
    "transcription": "Isi transkrip...",
    "summary": "Ringkasan isi...",
    "duration": 90.8,
    "type": "video",
    "originalSource": "file"
  }
}</pre>
        </div>

        <hr />
        <p><em>Semua response dikirim dalam format JSON.</em></p>
      </body>
    </html>
  `);
});

module.exports = router;
