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

        <div class="endpoint">
          <h3>GET /users/:id/stats</h3>
          <p>Get user stats buat dashboard</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
    "success": true,
    "message": "Berhasil mendapatkan stats user",
    "data": {
        "total": 10,
        "quizMade": 10,
        "averagePercentage": 0.30000000000000004
    }
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
  <p>Upload file video (.mp4, .mov) lalu otomatis diubah ke audio dan ditranskrip</p>
  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>
  <strong>Form-Data:</strong>
  <ul>
    <li><code>file</code>: file video (wajib)</li>
  </ul>
  <strong>Response:</strong>
  <pre>{
  "success": true,
  "message": "Berhasil membuat transcription",
  "transcript": {
    "_id": "xxx",
    "type": "video",
    "title": "namafile.mp4",
    "originalSource": "namafile.mp4",
    "transcription": "Isi transkrip...",
    "summary": "Ringkasan isi...",
    "duration": 90,
    "user": "userId"
  }
}</pre>
</div>


 <div class="endpoint">
          <h3>GET /transcribe</h3>
          <p>Mendapatkan semua transcription user sekarang</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Berhasil mendapatkan transcription user",
  "transcriptions": {[
    "_id": "xxx",
    "transcription": "Isi transkrip...",
    "summary": "Ringkasan isi...",
    "duration": 45.2,
    "type": "audio",
    "originalSource": "file"],[]
  }
}</pre>
        </div>

         <div class="endpoint">
          <h3>GET /transcribe/:id</h3>
          <p>Mendapatkan details transkripsi dari id transkripsi yang dimiliki user</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Berhasil mendapatkan transcription user",
  "transcription": {
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
          <h3>DELETE /transcribe/:id</h3>
          <p>Menghapus transkripsi dari id transkripsi yang dimiliki user</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Berhasil menghapus transkripsi",
  "transcription": {
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
          <h3>PUT /transcribe/:id</h3>
          <p>Mengedit judul dan summary transkripsi dari id transkripsi yang dimiliki user</p>
          <strong>Headers:</strong>
          <pre>Authorization: Bearer &lt;token&gt;</pre>
          <strong>Request Body:</strong>
          <pre>{
  "title": "Title edit",
  "summary": "lorem ipsum dolor sir amet",
}</pre>
          <strong>Response:</strong>
          <pre>{
  "success": true,
  "message": "Berhasil mengubah transkripsi",
  "transcription": {
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
  <h3>POST /transcribe/:id/ask</h3>
  <p>Mengirimkan pertanyaan berdasarkan isi transkripsi (summary atau transcription)</p>
  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>
  <strong>Request Body:</strong>
  <pre>{
  "question": "Apa poin utama dari meeting ini?"
}</pre>
  <strong>Response:</strong>
  <pre>{
  "success": true,
  "data": {
    "answer": "Penjelasan berdasarkan transkrip...",
    "question": "Apa poin utama dari meeting ini?",
    "transcription_id": "xxx",
    "chat_log_id": "xxx",
    "conversation_history_count": 3
  }
}</pre>
</div>

<div class="endpoint">
  <h3>GET /transcribe/:id/download</h3>
  <p>Download transcription dan summary ke pdf</p>
  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>
</div>

<div class="endpoint">
  <h3>GET /transcribe/:id/ask</h3>
  <p>Mendapatkan riwayat chat sebelumnya yang dikaitkan dengan transkripsi tersebut</p>
  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>
  <strong>Response:</strong>
  <pre>{
  "success": true,
  "chat_history": [
    {
      "_id": "chatlogId1",
      "question": "Siapa saja pembicara dalam video ini?",
      "answer": "Pembicara dalam video ini adalah...",
      "created_at": "2025-08-05T12:34:56.789Z"
    },
    {
      "_id": "chatlogId2",
      "question": "Apa yang dibahas pada menit ke 10?",
      "answer": "Topik pada menit ke 10 adalah...",
      "created_at": "2025-08-05T12:35:40.123Z"
    }
  ]
}</pre>
</div>

<div class="endpoint">
  <h3>POST /transcribe/:id/quiz</h3>
  <p>Menghasilkan soal pilihan ganda (quiz) dari hasil transkripsi tertentu.</p>

  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>

  <strong>Response:</strong>
  <pre>{
  "success": true,
  "mcqs": [
    {
      "question": "Apa inti pembahasan dalam video?",
      "options": {
        "a": "Topik A",
        "b": "Topik B",
        "c": "Topik C",
        "d": "Topik D"
      },
      "answer": "b"
    },
    ...
  ]
}</pre>
</div>

<div class="endpoint">
  <h3>GET /transcribe/:id/quiz</h3>
  <p>Mendapatkan quiz (soal dan jawaban) yang sebelumnya telah digenerate dari transkripsi.</p>

  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>

  <strong>Response:</strong>
  <pre>{
  "success": true,
  "message": "Berhasil mendapatkan quiz",
  "mcqs": [
    {
      "question": "Apa inti pembahasan dalam video?",
      "options": {
        "a": "Topik A",
        "b": "Topik B",
        "c": "Topik C",
        "d": "Topik D"
      },
      "answer": "b"
    },
    ...
  ]
}</pre>
</div>

<div class="endpoint">
  <h3>POST /transcribe/:id/submit_quiz</h3>
  <p>Submit jawaban quiz berdasarkan hasil transkripsi, sekaligus menghitung skor dan menyimpan hasilnya.</p>

  <strong>Headers:</strong>
  <pre>Authorization: Bearer &lt;token&gt;</pre>

  <strong>Body:</strong>
  <pre>{
  "answers": [
    {
      "questionIndex": 0,
      "selected": "a"
    },
    {
      "questionIndex": 1,
      "selected": "c"
    },
    ...
  ]
}</pre>

  <strong>Response:</strong>
  <pre>{
  "success": true,
  "message": "Quiz berhasil disubmit",
  "result": {
    "correctCount": 3,
    "wrongCount": 2,
    "percentage": 0.6,
    "answers": [
      {
        "questionIndex": 0,
        "selected": "a"
      },
      {
        "questionIndex": 1,
        "selected": "c"
      },
      ...
    ]
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
