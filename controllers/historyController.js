const User = require("../models/User");
const Event = require("../models/Event");
const Result = require("../models/Result");

async function handleGetHistory(req, res) {
  const { _id } = req.user;

   try {
    const user = await User.findById(_id);
    const wallet = user.wallet;

    const results = await Result.find({user: _id});

    return res.status(200).render("history.ejs", {results, wallet});

  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { handleGetHistory }
