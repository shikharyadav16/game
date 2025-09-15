const User = require("../models/User");
const Result = require("../models/Result");

async function handleGetHistory(req, res) {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    const wallet = user.wallet;
    let matchesPlayed = user.registeredArray.length;
    if (!matchesPlayed) {
      matchesPlayed = 0;
    }
    const maxWin = user.maxWin;
    const totalWin = user.totalWin;
    const rank =
      (await User.countDocuments({ totalWin: { $gt: totalWin } })) + 1;

    const results = await Result.find({ user: _id });

    return res
      .status(200)
      .render("history.ejs", {
        results,
        wallet,
        maxWin,
        rank,
        totalWin,
        matchesPlayed,
      });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { handleGetHistory };
