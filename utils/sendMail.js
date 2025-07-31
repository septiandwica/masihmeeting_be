const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
  let transporter;

  if (process.env.NODE_ENV === "development") {
    transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  await transporter.sendMail({
    from: `"MasihMeeting" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
