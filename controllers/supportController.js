const Support = require("../models/Support");
const User = require("../models/User");

async function handleGetSupport(req, res) {
    const _id = req.user;
  try {
    const wallet = (await User.findById(_id)).wallet

    const userChats = await Support.find({ role: _id });
    const botChats = await Support.find({ role: `BOT4${_id}` });

    let chats = [...userChats, ...botChats];
    chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).render("support.ejs", { chats, wallet });

  } catch (err) {
    console.log("Error:", err);
  }
}
module.exports = { handleGetSupport }
