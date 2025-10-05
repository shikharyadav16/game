const User = require("../models/User");
const Wallet = require("../models/Wallet");

async function handleGetWallet(req, res) {
  const { _id } = req.user;

  try {
    const user = await User.findById({ _id }).select({
      transactions: { $slice: -25 },
      wallet: 1,
    });

    if (!user) {
      return res.redirect("/login");
    }

    let { transactions, wallet } = user;
    const upi = user?.upi;
    transactions = Array.isArray(transactions)
      ? [...transactions].reverse()
      : [];

    return res.render("wallet.ejs", {
      wallet,
      transactions,
      upi: !upi ? "" : upi,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleUpdateUser(data) {
  try {
    const {
      transactionId,
      referenceId,
      type,
      source,
      amount,
      formattedDate,
      status,
      _id,
    } = data;

    const transaction = {
      transId: transactionId,
      referenceId,
      type,
      source,
      amount,
      status,
      date: formattedDate,
    };

    let updatedUser;

    const user = await User.findById(_id).select({
      transactions: { $slice: -50 },
      wallet: 1,
    });
    if (status !== "PENDING") {
      const existingIndex = user.transactions.findIndex(
        (t) => t.transId === transactionId
      );

      if (existingIndex > -1) {
        user.transactions[existingIndex] = {
          ...user.transactions[existingIndex],
          ...transaction,
        };

        if (status === "SUCCESS") {
          user.wallet += type === "credit" ? amount : -amount;
        }

        await user.save();
        updatedUser = user;
      } else {
        // Add new transaction + update wallet
        updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            $inc: { wallet: type === "credit" ? amount : -amount },
            $push: { transactions: transaction },
          },
          { new: true }
        );
      }
      
    } else if (status === "PENDING" && type === "debit") {
      updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $inc: { wallet: type === "debit" ? -amount : amount },
          $push: { transactions: transaction },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $push: { transactions: transaction },
        },
        { new: true }
      );
    }

    const balanceAfter = updatedUser.wallet;
    return balanceAfter;
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleUpdateWallet(data) {
  try {
    const {
      transactionId,
      referenceId,
      type,
      source,
      amount,
      formattedDate,
      status,
      balanceAfter,
      _id,
    } = data;

    console.log(data, "is data")

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
      updatedAt: formattedDate,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { handleGetWallet, handleUpdateWallet, handleUpdateUser };
