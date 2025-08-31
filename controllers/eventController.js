const Event = require("../models/Event");
const User = require("../models/User");

async function handleGetGames(req, res) {
    const { game, email } = req.user;
    try {
        const games = await Event.find({
            eventType: game,
        });
        const user = await User.findOne({ email });
        const wallet = await user.wallet;

        res.render('games.ejs', { games: games, wallet: wallet });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).render("server_error.ejs");
    }
}

async function handleGetFilteredGames(req, res) {
    const { size = "solo" } = req.params;
    const { game } = req.user;

    try {

        let games;

        if (size === "all-games") {
            games = await Event.find({
                eventType: game,
            });
        } else {
            games = await Event.find({
                eventType: game,
                eventTeamSize: size
            });
        }


        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ games });
        }

        res.render('games.ejs', { games: games });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).render("server_error.ejs");
    }
}

async function handleGetMyGames(req, res) {
    const { _id } = req.user;

    try {
        const user = await User.findById(_id);

        const events = await Event.find({ eventStatus: "upcoming" });

        const myEvents = await Event.find({
            _id: { $in: user.registeredArray },
            eventStatus: "upcoming"
        });

        return res.render("my-games", { wallet: user.wallet, myEvents, eventsJoined: myEvents.length, totalWin: user.totalWin, maxWin: user.maxWin });

    } catch (err) {
        console.log("Error:", err);
    }
}

module.exports = { handleGetGames, handleGetFilteredGames, handleGetMyGames }