const nodemailer = require('nodemailer');
const { generateOTP } = require("../memory/otpStore")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nextscrimz@gmail.com',
        pass: 'iqiq jgkj yjce sxhe'
    }
});

function sendMail(email, ign) {

    const otp = generateOTP(email);

    const mailOptions = {
        from: 'nextscrimz@gmail.com',
        to: email,
        subject: 'Your NextScrimz OTP Code',
        html: `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #2D89EF;">Next Scrimz Verification Code</h2>
    <p>Hello <strong>${ign}</strong>,</p>

    <p>Thank you for signing up for <strong>Next Scrimz</strong> – your hub for competitive gaming scrims and events.</p>

    <p>To verify your email and activate your account, please use the following One-Time Password (OTP):</p>

    <h1 style="color: #333; font-size: 32px; text-align: center; letter-spacing: 2px;">${otp}</h1>

    <p>This code is valid for the next <strong>10 minutes</strong>. Do not share this code with anyone for security reasons.</p>

    <p>If you didn’t request this OTP, please ignore this email.</p>

    <hr style="margin: 24px 0;">
    <footer style="font-size: 14px; color: #777;">
      <p>Stay sharp,<br>
      The NextScrimz Team</p>
      <p>Visit us: <a href="https://nextscrimz.com" target="_blank">nextscrimz.com</a></p>
    </footer>
  </body>
</html>
`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };