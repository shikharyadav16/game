const axios = require("axios");
const path = require("path")
const Wallet = require("../models/Wallet")
const crypto = require("crypto")
const Withdraw = require("../models/Withdraw");
const fs = require("fs");
const User = require("../models/User")
const { handleUpdateWallet, handleUpdateUser } = require("./walletController");

// PG (Add Money)
const PG_BASE = "https://sandbox.cashfree.com/pg";
const PG_CLIENT_ID = "TEST430329ae80e0f32e41a393d78b923034";
const PG_CLIENT_SECRET = "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";

// Payout (Withdraw)
const PAYOUT_BASE = "https://payout-gamma.cashfree.com";
const PAYOUT_CLIENT_ID = "CF10729621D2L099T3LO7C73A1M7LG";
const PAYOUT_CLIENT_SECRET = "cfsk_ma_test_5375e6fbf5833b1a511962bf5ee7eb99_74c72ef5";

// 1️⃣ Add Money
const handleAddMoney = async (req, res) => {
  const { amount } = req.body;
  const { email, _id } = req.user;

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
          return_url: `http://localhost:3000/payment-success?order_id={order_id}`
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

    res.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
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
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    let balanceAfter;

    switch (status) {
      case "PAID":   // ✅ Success
      case "SUCCESS":

        //Wallet updation
        balanceAfter = await handleUpdateUser({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "SUCCESS", _id: req.user._id });

        //transaction updation
        await handleUpdateWallet({ transactionId, referenceId, type: "credit", source: "topup", amount, formattedDate, status: "SUCCESS", balanceAfter, _id: req.user._id });

        return res.redirect("/wallet")

      case "ACTIVE":

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

// // 3️⃣ Get Payout Token
// async function getPayoutToken() {
//   // const signature = generateSignature();
//   const res = await axios.post(
//     `${PAYOUT_BASE}/payout/v1/authorize`,
//     {},
//     {
//       headers: {
//         "X-Client-Id": PAYOUT_CLIENT_ID,
//         "X-Client-Secret": PAYOUT_CLIENT_SECRET,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   console.log(res.data)
//   if (res.data?.status === "SUCCESS") {
//     return res.data.data.token;
//   } else {
//     throw new Error(res.data.message || "Failed to generate token");
//   }
// }

// // 4️⃣ Withdraw Money
// const handleWithdrawMoney = async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const token = await getPayoutToken();
//     const response = await axios.post(
//       `https://sandbox.cashfree.com/payout/v2/requestTransfer`,
//       {
//         beneId: "user123_wallet",
//         amount,
//         transferId: "txn_" + Date.now(),
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     res.json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// }


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

    const transId = "_draw" + Date.now();

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