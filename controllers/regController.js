const Event = require("../models/Event");
const User = require("../models/User");
const Wallet = require("../models/Wallet");

async function handleGetEventRegister(req, res) {
    const { id } = req.params;
    const { _id } = req.user;
    const eventId = Number(id);
    if (Number.isNaN(eventId)) {
        return res.json({ Error: "Invalid Request from the server!" })
    }
    try {
        const event = await Event.findOne({ eventId });

        if (!event) {
            return res.status(404).json({ Error: "Event not found" });
        }

        if (event.eventArray.includes(_id)) {
            return res.status(400).json({ success: false, message: "Already joined in this event." })
        }
        const user = (await User.findById(_id));
        const { wallet, ign } = user;

        return res.status(200).render("payment.ejs", { event, wallet, ign });
    } catch (err) {
        console.log("Error:", err);
    }
}

async function handleRegPayment(req, res) {
    const { id } = req.body;
    const { _id } = req.user;

    try {

        const eventId = Number(id);
        if (Number.isNaN(eventId)) {
            return res.status(400).json({ success: false, message: "Invalid event ID!" });
        }

        const event = await Event.findOne({ eventId });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found!" });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).redirect("/login");
        }

        if (user.wallet < event.eventEntry + 1) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }
        user.wallet -= event.eventEntry + 1;

        if (!user.registeredArray.includes(event._id)) {
            user.registeredArray.push(event._id);
        }

        if (!event.eventArray.includes(_id)) {
            event.eventArray.push(_id);
        }


        await user.save();
        await event.save();
        updateTransactions(_id, event.eventEntry + 1);

        res.status(200).json({ success: true, redirectedto: "/my-games", wallet: user.wallet })

    } catch (err) {
        console.log("Error:", err);
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
    }
}

module.exports = { handleGetEventRegister, handleRegPayment, updateTransactions };