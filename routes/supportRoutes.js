const express = require("express");
const router = express.Router();
const { handleGetSupport } = require("../controllers/supportController.js")

router.get("/support", handleGetSupport)


module.exports = router;