const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// dotenv.config({ path: "./NodeMailerConfig.env" });

const user = process.env.USER;
const pass = process.env.PASS;

// Create a transporter using your email service settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  //   port: 465,
  //   secure: true,
  auth: {
    user: user,
    pass: pass,
  },
});

// Send an email with a reset link
const sendPasswordResetEmail = (email, token) => {
  const mailOptions = {
    from: "ameen.desk@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: https://website-login-aw.netlify.app
    and click "Route to Enter Password Reset String- Button from home page"
    Then insert the token to verify TOKEN:${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendPasswordResetEmail };
