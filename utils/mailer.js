const nodemailer = require('nodemailer');
const { generateOTP } = require("../memory/otpStore")
require("dotenv").config();
const user = process.env.MAILER_USER;
const password = process.env.MAILER_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: password
    }
});

function sendMail(email, ign) {

    const otp = generateOTP(email);

    const mailOptions = {
        from: 'nextscrimz@gmail.com',
        to: email,
        subject: 'Your NextScrimz OTP Code',
        html: `<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Your NextScrimz OTP Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #161616; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #161616;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Logo -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="color: #ffe69b; margin: 0; font-size: 28px; font-weight: bold;">NextScrimz</h1>
                        </td>
                    </tr>
                    
                    <!-- Email Content -->
                    <tr>
                        <td style="background-color: #2d3436; border-radius: 10px; padding: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <h2 style="color: #ffe69b; margin-top: 0; font-size: 24px;">Verification Code</h2>
                            <p style="color: #f7f9fc; font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for NextScrimz.com is:</p>
                            
                            <!-- Mobile Notification Style OTP -->
                            <div style="background-color: #161616; border-left: 4px solid #00cec9; padding: 15px; margin: 25px 0; text-align: left; border-radius: 4px;">
                                <p style="color: #f7f9fc; margin: 0 0 5px 0; font-size: 14px;">NextScrimz Security</p>
                                <h3 style="color: #ffe69b; margin: 0; font-size: 28px; letter-spacing: 8px;">${otp}</h3>
                                <p style="color: #f7f9fc; margin: 5px 0 0 0; font-size: 12px;">Valid for 10 minutes</p>
                            </div>
                            
                            <p style="color: #f7f9fc; font-size: 14px;">Enter this code to complete your verification. For security reasons, this code will expire in 10 minutes.</p>
                            <p style="color: #f7f9fc; font-size: 14px;">If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
                        </td>
                    </tr>
                    
                    <!-- Support Info -->
                    <tr>
                        <td align="center" style="padding-top: 30px;">
                            <p style="color: #949494; font-size: 12px; margin: 0;">Need help? Contact our support team at <a href="mailto:support@nextscrimz.com" style="color: #00cec9;">support@nextscrimz.com</a></p>
                            <p style="color: #949494; font-size: 12px; margin: 10px 0 0 0;">© 2023 NextScrimz.com. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };