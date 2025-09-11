const User = require("../models/User");

async function handleGetProfile(req, res) {
  const email = req.user.email;

  try {
    const user = await User.findOne({ email: email });
    const wallet = user.wallet;
    return res.status(200).render("profile", { user, wallet });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

async function handleUpdateProfile(req, res) {
  const email = req.user.email;
  const { username, ign, upi, game } = req.body;

  try {
    let query = {};
    if (username) {
      query.username = username;
    }
    if (ign) {
      query.ign = ign;
    } else {
      return res.status(403).json({ status: false, message: "In game name is required." });
    }
    if (upi) {
      query.upi = upi;
    }
    if (game) {
      query.game = game;
    }

    if (game !== "ff" && game !== "bgmi") {
      return res.status(403).json({ Error: "Invalid game type" });
    }
    req.user.game = game
    
    const user = await User.findOneAndUpdate({email}, query, {
        new: true,
        runValidators: true,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Changes have been saved successfully.",
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(501).json({success: false, message: err.message});
  }
}

module.exports = { handleGetProfile, handleUpdateProfile };
