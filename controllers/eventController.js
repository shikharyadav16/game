const Event = require("../models/Event");
const User = require("../models/User");

async function handleGetGames(req, res) {
    const { type = "bgmi", size = "solo" } = req.params;

    try {
        const games = await Event.find({
            eventType: type,
            eventTeamSize: size
        });

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ games });
        }

        res.render('home.ejs', { games: games });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).render("server_error.ejs");
    }
}

async function handleGetMyGames(req, res) {
    const { type = "bgmi", size = "solo", lobby = "games" } = req.params;
    const { userEmail } = req.body
    
    try {
        
        if (lobby === "games") {
            const games = await Event.find({
                eventType: type,
                eventTeamSize: size
            });
            
            if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.json({ games });
            }
            
            return res.render('home.ejs', { games: games });
        }
        
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ success: false, redirect: "/login" });
        }

        let games = [];

        for (const objId of user.registeredArray) {
            let game = await Event.findOne({ _id: objId, eventType: type, eventTeamSize: size });
            if (game) {
                games.push(game);
            }
        }

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ games });
        }
        res.render('home.ejs', { games: games });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).render("server_error.ejs");
    }
}


module.exports = { handleGetGames, handleGetMyGames }