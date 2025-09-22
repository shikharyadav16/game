const express = require("express");
const { handleSetImage } = require("../controllers/authController.js")
const { handleGetGames, handleGetFilteredGames, handleGetMyGames, handleGetMyIdp, handleGetDetails } = require("../controllers/eventController");
const { handleGetWallet } = require("../controllers/walletController");
const { handleGetProfile, handleUpdateProfile } = require("../controllers/profileController");
const { handleGetHistory } = require("../controllers/historyController")
const { handleGetLeaderboard, handleGetFilteredLeadeBoard } = require("../controllers/leaderboardController.js")
const router = express.Router();

router.get("/profile-image", (req, res)=> {
    return res.status(200).render("profile-image")
});

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
router.post('/set-image', handleSetImage)


module.exports = router;