const express = require("express");
const { handleAddMoney, handleSuccessPayment, handleWithdrawMoney } = require("../controllers/cashfree");
const router = express.Router();

router.post("/add-money", handleAddMoney);
router.get("/payment-success", handleSuccessPayment);
router.post("/withdraw-money", handleWithdrawMoney);

module.exports = router;