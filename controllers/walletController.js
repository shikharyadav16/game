const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Withdraw = require("../models/Withdraw");

async function handleGetWallet(req, res) {
    const { _id } = req.user;

    try {
        const user = await User.findById({ _id }).select({ transactions: { $slice: -25 }, wallet: 1 });

        if (!user) {
            return res.redirect("/login");
        }

        let { transactions, wallet } = user;
        transactions = Array.isArray(transactions) ? [...transactions].reverse() : [];

        return res.render("wallet.ejs", { wallet, transactions });

    } catch (err) {
        console.log("Error:", err);
    }
}

async function handleUpdateUser(data) {
    const { transactionId, referenceId, type, source, amount, formattedDate, status, _id } = data;

    const transaction = {
        transId: transactionId,
        referenceId,
        type,
        source,
        amount,
        status,
        date: formattedDate
    };

    let updatedUser;

    if (status !== "PENDING") {
        const user = await User.findById(_id).select({ transactions: { $slice: -50 }, wallet: 1 });

        const existingIndex = user.transactions.findIndex(t => t.transId === transactionId);

        if (existingIndex > -1) {
            user.transactions[existingIndex] = { ...user.transactions[existingIndex], ...transaction };

            if (status === "SUCCESS") {
                user.wallet += (type === "credit" ? amount : -amount);
            }

            await user.save();
            updatedUser = user;
        } else {
            // Add new transaction + update wallet
            updatedUser = await User.findByIdAndUpdate(
                _id,
                {
                    $inc: { wallet: type === "credit" ? amount : -amount },
                    $push: { transactions: transaction }
                },
                { new: true }
            );
        }
    } else {
        updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $push: { transactions: transaction }
            },
            { new: true }
        );
    }

    const balanceAfter = updatedUser.wallet;
    return balanceAfter;
}


async function handleUpdateWallet(data) {
    const { transactionId, referenceId, type, source, amount, formattedDate, status, balanceAfter, _id } = data;

    await Wallet.create({
        userId: _id,
        transId: transactionId,
        referenceId: referenceId,
        type: type,
        source: source,
        amount: amount,
        balanceAfter: balanceAfter,
        status: status,
        createdAt: formattedDate,
        updatedAt: formattedDate
    });
}

async function handleWithdrawFunds(req, res) {
    const { email, _id } = req.user;
    const { upi, amount } = req.body;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.redirect("/login");
        }
        const transId = "_draw" + Date.now();

        const withdrawObj = {
            _id,
            email,
            transId,
            upi,
            amount,
            balanceAfter: user.amount - amount,
            status: "PENDING",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        updateWithdrawReq(_id, email, upi, amount)
        updateWithdrawTransactions()


    } catch (err) {
        console.log("Error:", err);
    }
}


module.exports = { handleGetWallet, handleUpdateWallet, handleUpdateUser };