const express = require("express");
const { handleGetGames, handleGetFilteredGames, handleGetMyGames, handleGetMyIdp, handleGetDetails } = require("../controllers/eventController");
const { handleGetWallet } = require("../controllers/walletController");
const { handleGetProfile, handleUpdateProfile } = require("../controllers/profileController");
const { handleGetHistory } = require("../controllers/historyController")
const { handleGetLeaderboard, handleGetFilteredLeadeBoard } = require("../controllers/leaderboardController.js")
const router = express.Router();

router.get("/games", handleGetGames);
router.get("/games/:size", handleGetFilteredGames);

router.get("/my-games", handleGetMyGames)
router.post("/idp", handleGetMyIdp)

router.get("/profile", handleGetProfile);
router.patch("/profile", handleUpdateProfile);

router.get("/wallet", handleGetWallet);

router.get("/history", handleGetHistory);

router.get("/leaderboard", handleGetLeaderboard);
router.get("/leaderboard/:game", handleGetFilteredLeadeBoard);

router.post("/details", handleGetDetails);

module.exports = router;