const User = require("../models/User");

async function handleGetProfile(req, res) {
    const email = req.user.email;

    try {
        const user = await User.findOne({ email: email });
        return res.status(200).render("profile", { user });

    } catch (err) {
        return res.status(500).json({ msg: "Internal server error!" })
    }
}

async function handleUpdateProfile(req, res) {
    const email = req.user.email;
    const { username, ign, upi } = req.body;

    try {
        const user = await User.findOneAndUpdate(email, { username, ign, upi }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(401).json({ success: false, description: "User not found.", name: "Updation Error!" });
        }

        return res.status(201).json({ success: true, description: "Changes have been saved successfully.", name: "Success!" })

    } catch (err) {
        console.log("Error:", err);
        return res.status(501).render("server_error.ejs");
    }
}



module.exports = { handleGetProfile, handleUpdateProfile };