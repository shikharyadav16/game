// const mongoose = require("mongoose");
const { sendMail } = require("../utils/mailer");
const { checkOTP } = require("../memory/otpStore");
const User = require("../models/User");

async function sendOTP(req, res) {
    const { email, ign } = req.body;
    try {
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(409).json({success: false, description: "Email already in use. Please use different email.", name: "Signup error!" });
        }
        await sendMail(email, ign);
        return res.status(200).json({success: true, redirected: "/otp-verification"});

    } catch (err) {
        console.log("Error:", err);
        return res.render("server_error.ejs");
    }
}

async function verifyOTP(req, res) {
    const {email, otp, userUpi, userIgn, userPassword} = req.body;
    if (checkOTP(otp, email)) {
        try {
            await User.create({
                ign: userIgn,
                upi: userUpi,
                email: email,
                password: userPassword
            });
        } catch(err) {
            console.log("Error:", err);
            return res.json(501).render("server_error.ejs")
        }
        return res.status(200).json({ redirected: "/" });
    } else {
        return res.status(400).json({ success: false, description: "Invalid OTP for this email.", name: "Verification error!" });
    }
}

async function checkLogin(req, res) {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(404).json({success: false, description: "User not found, Invalid email address.", name: "Login error!"})
        }
        if (user.password !== password) {
            return res.status(401).json({success: false, description: "Invalid password.", name: "Login error!"})
        }
        return res.status(200).json({success: true, redirected: "/"});
    } catch(err) {
        console.log("Error:", err);
        return res.status(500).render("server_error.ejs")
    }
}

module.exports = { sendOTP, verifyOTP, checkLogin };