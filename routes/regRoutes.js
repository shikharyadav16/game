const express = require("express");
const { handleGetEventRegister, handleRegPayment } = require("../controllers/regController");
const router = express.Router();

router.get("/game/:id", handleGetEventRegister)
router.post("/payment", handleRegPayment);

module.exports = router;