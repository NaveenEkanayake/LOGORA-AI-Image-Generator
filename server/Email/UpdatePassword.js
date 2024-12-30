const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendForgotPasswordEmail(to, resetLink) {
  const mailOptions = {
    from: '"Imagify.dev" <nekanayake789@gmail.com>',
    to: to,
    subject: "Password Reset Request",
    html: `
            <div style="font-family: 'Google Sans', 'Noto Naskh Arabic UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
                <h2 style="color: #000; text-align: center;"><em>Imagify Ai generator</em></h2>
                <p style="color: #000; font-size: 16px;">
                    Dear user,
                </p>
                <p style="color: #000; line-height: 1.6;">
                    You recently requested to reset your password for your Imagify account. Click the button below to reset it. If you did not request a password reset, please ignore this email.
                </p>
                <p style="text-align: center;">
                    <a href="${resetLink}" style="color: #ffffff;  background-color: #007bff; padding: 10px 20px;  width: 200px;  text-decoration: none; font-weight: bold; border-radius: 20px; display: inline-block;">Reset Password</a>
                </p>
                <p style="color: #000; line-height: 1.6; margin-top: 20px;">
                    This link will expire in 1 hour.
                </p>
                <p style="text-align: center; font-size: 12px; color: #999;">
                    © Copyright @Imagify.dev | All right reserved.
                </p>
            </div>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending password reset email:", error);
  }
}

module.exports = { sendForgotPasswordEmail };
