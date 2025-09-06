const express = require("express");
const router = express.Router();
const { handleGetSupport, handleSendMessages } = require("../controllers/supportController.js")

router.get("/support", handleGetSupport);
router.post("/chat", handleSendMessages);


module.exports = router;