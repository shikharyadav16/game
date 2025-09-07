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
    chats = chats.reverse();
    return res.status(200).render("support.ejs", { chats, wallet });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({success: false, message: err.message})
  }
}

async function handleSendMessages(req, res) {
  const { text } = req.body;
  const { _id } = req.user;
  
  try {
    await Support.create({
      text: text,
      role: _id
    });
    
    return res.status(200).json({success: true, message: "Your message has been sent successfully. Our admin team will review it and respond shortly."});
    
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({success: false, message: err.message})
  }
}

module.exports = { handleGetSupport, handleSendMessages }
