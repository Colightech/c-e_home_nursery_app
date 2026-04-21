require("dotenv").config();
const nodemailer = require("nodemailer");


async function sendEmail(to, subject, text) {
  try {
    let transporter = nodemailer.createTransport({
      host : "smtp-relay.brevo.com",  // or your SMTP provider
      port : 587,
      secure : false, //true for 465, and false for other port
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"c e home nursery" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      text
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

module.exports = sendEmail;
