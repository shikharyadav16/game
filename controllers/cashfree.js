const axios = require("axios");
const Withdraw = require("../models/Withdraw");
const User = require("../models/User")
require("dotenv").config();
const { handleUpdateWallet, handleUpdateUser } = require("./walletController");

// PG (Add Money)


const PG_BASE = process.env.PG_BASE;
const PG_CLIENT_ID = process.env.PG_CLIENT_ID;
const PG_CLIENT_SECRET = process.env.PG_CLIENT_SECRET;


// 1️⃣ Add Money
const handleAddMoney = async (req, res) => {
  const { amount } = req.body;
  const { email, _id } = req.user;
  const redirectUrl = `https://${req.get("host")}/payment-success?order_id={order_id}`
  
  try {

    const phone = String((await User.findOne({ email }))?.phone || "");

    const response = await axios.post(
      `${PG_BASE}/orders`,
      {
        order_id: "order_" + Date.now(),
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: _id,
          customer_email: email,
          customer_phone: phone,
        },
        order_meta: {
          return_url: redirectUrl
        },
      },
      {
        headers: {
          "x-client-id": PG_CLIENT_ID,
          "x-client-secret": PG_CLIENT_SECRET,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    // console.log({
    //   order_id: response.data.order_id,
    //   payment_session_id: response.data.payment_session_id,
    // })

    res.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
}

// 2️⃣ Payment Success Verification
const handleSuccessPayment = async (req, res) => {
  const { order_id } = req.query;

  try {
    const response = await axios.get(`${PG_BASE}/orders/${order_id}`, {
      headers: {
        "x-client-id": PG_CLIENT_ID,
        "x-client-secret": PG_CLIENT_SECRET,
        "x-api-version": "2022-09-01",
      },
    });

    const data = response.data;

    const transactionId = data.order_id;      // merchant transaction id
    const referenceId = data.cf_order_id;     // cashfree reference id
    const status = data.order_status;
    const amount = data.order_amount;
    const formattedDate = Date.now();
    let balanceAfter;

    console.log("Formatted Dtae dsfasdf", formattedDate)

    switch (status) {
      case "PAID":   
      case "SUCCESS":

        //Wallet updation
        balanceAfter = await handleUpdateUser({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "SUCCESS", _id: req.user._id });

        //transaction updation
        await handleUpdateWallet({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "SUCCESS", balanceAfter, _id: req.user._id });

        return res.redirect("/wallet")

      case "ACTIVE":
        console.log("Formatted Dtae", formattedDate)

        balanceAfter = await handleUpdateUser({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "PENDING", _id: req.user._id });

        //transaction updation
        await handleUpdateWallet({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "PENDING", balanceAfter, _id: req.user._id });

        return res.redirect("/wallet");
      default:
        return res.redirect("/wallet")
    }

  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

async function handleWithdrawMoney(req, res) {
  const { email, _id } = req.user;
  const { upi } = req.body;
  const sAmount = req.body.amount;

  const amount = Number(sAmount);
  if (isNaN(amount)) {
    return res.status(403).json({ success: false, message: "Invalid amount type." });
  }


  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.redirect("/login");
    }
    const currentBalance = Number(user.wallet);
    if (isNaN(currentBalance)) {
      return res.status(500).json({ success: false, message: "User balance corrupted" });
    }

    const balanceAfter = currentBalance - amount;
    if (balanceAfter < 0) {
      return res.status(403).json({ success: false, message: "Insufficient balance." });
    }

    const transId = "draw_" + Date.now();

    const withdrawObj = {
      userId: _id,
      email,
      transId,
      upi,
      amount,
      balanceAfter,
      status: "PENDING",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    await handleUpdateUser({ transactionId: transId, referenceId: null, type: "debit", source: "withdraw", amount, formattedDate: Date.now(), status: "PENDING", balanceAfter, _id: req.user._id });
    await handleUpdateWallet({ transactionId: transId, referenceId: null, type: "debit", source: "withdraw", amount, formattedDate: Date.now(), status: "PENDING", balanceAfter, _id: req.user._id });
    await Withdraw.create(withdrawObj);

    return res.status(200).json({ success: true, redirectedTo: "/wallet" });

  } catch (err) {
    console.log("Error:", err);
  }
}



module.exports = { handleAddMoney, handleSuccessPayment, handleWithdrawMoney };