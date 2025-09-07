const Event = require("../models/Event");
const User = require("../models/User");
const Wallet = require("../models/Wallet");

async function handleGetEventRegister(req, res) {
    const { id } = req.params;
    const { _id } = req.user;

    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
        return res.status(400).send("Invalid Request from the server!");
    }

    try {
        const user = await User.findById(_id);
        if (!user) return res.redirect("/login");

        const event = await Event.findOne({ eventId });
        if (!event) return res.status(404).json({success: false, message: "Event not found"});

        if (event.eventArray.includes(_id)) {
            return res.status(403).json({success: false, message: "Already joined in this event"});
        }

        const { wallet, ign } = user;
        return res.render("payment.ejs", { event, wallet, ign });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({success: false, message: err.message});
    }
}

async function handleRegPayment(req, res) {
    const { id } = req.body;
    const { _id } = req.user;

    try {
        // Validate eventId
        const eventId = Number(id);
        if (!Number.isInteger(eventId) || eventId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid event ID!" });
        }

        const event = await Event.findOne({ eventId });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found!" });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ success: false, redirectedTo: "/login" });
        }

        // Check if already registered
        if (event.eventArray.includes(_id)) {
            return res.status(409).json({ success: false, message: "Already registered in this event" });
        }

        // Wallet check
        const totalCost = event.eventEntry; // 1 for handling fee?
        if (user.wallet < totalCost) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }

        // Deduct balance
        user.wallet -= totalCost;

        // Push registration references
        if (!user.registeredArray.includes(event._id)) {
            user.registeredArray.push(event._id);
        }
        if (!event.eventArray.includes(_id)) {
            event.eventArray.push(_id);
        }

        // Save updates
        await Promise.all([user.save(), event.save()]);
        await updateTransactions(_id, totalCost);

        return res.status(200).json({
            success: true,
            redirectedTo: "/my-games",
            wallet: user.wallet
        });

    } catch (err) {
        console.error("Error in handleRegPayment:", err);
        return res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
}


async function updateTransactions(_id, entryFee) {
    try {
        const user = await User.findById(_id);
        const transId = "event_" + Date.now();

        const userTransaction = {
            transId: transId,
            type: "debit",
            source: "event_entry",
            amount: entryFee,
            status: "SUCCESS",
            date: Date.now()
        }

        user.transactions.push(userTransaction)
        await user.save();

        const transaction = {
            userId: _id,
            transId: transId,
            type: "debit",
            source: "event_entry",
            amount: entryFee,
            balanceAfter: user.wallet,
            status: "SUCCESS",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        await Wallet.create(transaction);

    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({success: false, message: err.message})
    }
}

module.exports = { handleGetEventRegister, handleRegPayment, updateTransactions };