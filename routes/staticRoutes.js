const express = require("express");
const { handleGetGames, handleGetMyGames } = require("../controllers/eventController");
// const { handleGetProfile } = require("../controllers/profileController");
const router = express.Router();

router.get("/games/:type/:size", handleGetGames);
router.post("/:lobby/:type/:size", handleGetMyGames);

// router.get("/profile", handleGetProfile);

module.exports = router;