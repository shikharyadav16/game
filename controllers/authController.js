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
            return res.status(409).json({ success: false,  name: "Account error!", description: "Email already in use. Please use different email.", name: "Signup error!" });
        }
        await sendMail(email);
        return res.status(200).json({ success: true, redirected: "/otp-verification" });

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({success: false, description: err.message, name: "Singup error!"})
    }
}

async function verifyOTP(req, res) {

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
            return res.status(200).json({ redirected: `/profile-image` });
            
        } catch (err) {
            console.log("Error:", err);
            return res.status(500).json({success: false, description: err.message, name: "Singup error!"})
        }

    } else {
        return res.status(403).json({ success: false, description: "Invalid OTP for this email.", name: "Verification error!" });
    }
}

async function checkLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, description: "User not found, Invalid email address.", name: "Login error!" })
        }
        if (user.status === "banned") {
            return res.status(403).json({ success: false, description: "Your account is currently paused" })
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
        return res.status(500).json({success: false, description: err.message, name: "Login error!"})
    }
}

async function handleSetImage(req, res) {
    const image = req.body.image.trim();
    const { _id } = req.user;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(200).json({ success: false, redirectedTo: "/login"})
        }

        let flag = false;

        for (let i=0; i<14; i++) {
            if (image === `profile-${i+1}`) {
                flag = 1
            }
        }

        if (flag) {
            user.profileImage = image
            await user.save()
            return res.status(201).json({success: true, redirectedTo: "/games"})

        } else {
            return res.status(403).json({ success: false , message: "Invalid Profile Image selected!"})
        }

    } catch (err) {
        console.log("Error:", err)
    }
}

module.exports = { sendOTP, verifyOTP, checkLogin, handleSetImage };