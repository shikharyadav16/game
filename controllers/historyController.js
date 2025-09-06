const User = require("../models/User");
const Event = require("../models/Event");

async function handleGetHistory(req, res) {
  const { _id } = req.user;

   try {
    const user = await User.findById(_id);
    const wallet = user.wallet;
    const events = await Event.find({ _id: { $in: user.registeredArray } })

    console.log(events);
    return res.status(200).render("history.ejs", {events, wallet});

  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { handleGetHistory }
