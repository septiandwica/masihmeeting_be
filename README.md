# MasihMeeting API

API backend untuk platform **MasihMeeting**, sistem manajemen user dengan autentikasi JWT dan Google OAuth. Terdapat dokumentasi di route utama dan koleksi Postman tersedia.

## 🚀 Fitur Utama

- Register & Login dengan Email
- Google OAuth Login
- Verifikasi Email via Token
- CRUD User (Admin & User)
- Middleware proteksi akses
- Dokumentasi endpoint tersedia di route `/`

## 🧪 Teknologi

- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JWT
- Nodemailer (dengan Mailtrap/Gmail SMTP)
- Postman Collection

## 🔐 .env Example

```
PORT=3000
HOSTNAME=localhost

MONGO_URL=mongodb://localhost:27017/masihmeeting

CLIENT_URL=http://localhost:5173
AI_URL=http://localhost:5000

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/auth/google/callback

NODE_ENV=development

# Gunakan salah satu
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
```

## 📮 Postman

Import koleksi [MasihMeeting.postman_collection.json](./MasihMeetingAPI.postman_collection.json) ke Postman.

## 🧾 Dokumentasi

Jalankan server, lalu akses dokumentasi API di:

```
http://localhost:3000/
```

## 🛠️ Jalankan Lokal

```bash
git clone <repo-url>
cd masihmeeting-backend
npm install
npm run dev
```

## 🙌 Kontribusi

YTTA

---

🧑‍💻 Dibuat dengan ❤️ oleh tim MasihMeeting
