const otpStore = {};

function generateOTP(email) {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP is set", otp)
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    };
    return otp;
}

function checkOTP(otp, email) {
    const record = otpStore[email];

    if (record.otp === otp) {
        delete otpStore[email];
        return true;
    } else {
        return false
    }
}

module.exports = { generateOTP, checkOTP };