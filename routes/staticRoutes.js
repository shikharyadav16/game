const express = require("express");
const { handleGetGames, handleGetMyGames } = require("../controllers/eventController");
const router = express.Router();

router.get("/games/:type/:size", handleGetGames);
router.post("/:lobby/:type/:size", handleGetMyGames);

router.get("/profile", (req, res)=> {
    return res.render("profile.ejs");
});

module.exports = router;