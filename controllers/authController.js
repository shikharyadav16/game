// const mongoose = require("mongoose");
const { sendMail } = require("../utils/mailer");
const { checkOTP } = require("../memory/otpStore");
const { setUser } = require("../services/auth");
const { hashPassword, verifyPassword } = require("../services/hash");
const User = require("../models/User");

async function sendOTP(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(409).json({ success: false, description: "Email already in use. Please use different email.", name: "Signup error!" });
        }
        await sendMail(email);
        return res.status(200).json({ success: true, redirected: "/otp-verification" });

    } catch (err) {
        console.log("Error:", err);
        return res.render("server_error.ejs");
    }
}

async function verifyOTP(req, res) {


    const playerAvatar = ["https://static.vecteezy.com/system/resources/thumbnails/054/555/561/small/a-man-wearing-headphones-and-sunglasses-is-wearing-a-hoodie-free-vector.jpg"]


    const { email, otp, userGame, userIgn, userPassword, userPhone } = req.body;
    if (checkOTP(otp, email)) {
        try {
            const hashedPasswword = await hashPassword(userPassword);

            await User.create({
                ign: userIgn,
                game: userGame,
                email: email,
                password: hashedPasswword,
                phone: userPhone
            });
            const user = await User.findOne({ email });
            const token = setUser({
                _id: user._id,
                email: user.email,
                userGame: user.game,
                userIgn: user.ign
            });
            res.cookie("uid", token, {
                httpOnly: true,
                secure: false,
            });

        } catch (err) {
            console.log("Error:", err);
            return res.json(501).render("server_error.ejs")
        }
        return res.status(200).json({ redirected: `/games` });
    } else {
        return res.status(400).json({ success: false, description: "Invalid OTP for this email.", name: "Verification error!" });
    }
}

async function checkLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, description: "User not found, Invalid email address.", name: "Login error!" })
        }
        if (!(await verifyPassword(password, user.password))) {
            return res.status(401).json({ success: false, description: "Invalid password.", name: "Login error!" })
        }

        const token = setUser({
            _id: user._id,
            email: user.email,
            userGame: user.game,
            userIgn: user.ign
        });
        res.cookie("uid", token, {
            httpOnly: true,
            secure: false,
        });
        return res.status(200).json({ success: true, redirected: `/games` });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).render("server_error.ejs")
    }
}

module.exports = { sendOTP, verifyOTP, checkLogin };