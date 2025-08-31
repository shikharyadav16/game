const express = require("express");
const { handleGetGames, handleGetFilteredGames, handleGetMyGames } = require("../controllers/eventController");
const { handleGetWallet } = require("../controllers/walletController");
const { handleGetProfile, handleUpdateProfile } = require("../controllers/profileController");
const router = express.Router();

router.get("/games", handleGetGames);
router.get("/games/:size", handleGetFilteredGames);

router.get("/my-games", handleGetMyGames)

router.get("/profile", handleGetProfile);
router.patch("/profile", handleUpdateProfile);

router.get("/wallet", handleGetWallet);

module.exports = router;