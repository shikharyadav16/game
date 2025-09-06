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

    res.render("games.ejs", { games: games, wallet: wallet });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).render("server_error.ejs");
  }
}

async function handleGetFilteredGames(req, res) {
  const { size = "solo" } = req.params;
  const { game } = req.user;
  const { _id } = req.body;

  try {
    const wallet = (await User.findById(_id)).wallet;

    let games;

    if (size === "all-games") {
      games = await Event.find({
        eventType: game,
      });
    } else {
      games = await Event.find({
        eventType: game,
        eventTeamSize: size,
      });
    }

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res.json({ games });
    }

    res.render("games.ejs", { games: games, wallet });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).render("server_error.ejs");
  }
}

async function handleGetMyGames(req, res) {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    const myEvents = await Event.find({
      _id: { $in: user.registeredArray },
      eventStatus: "upcoming",
    });

    return res.render("my-games", {
      wallet: user.wallet,
      myEvents,
      eventsJoined: myEvents.length,
      totalWin: user.totalWin,
      maxWin: user.maxWin,
    });
  } catch (err) {
    console.log("Error:", err);
  }
}

async function handleGetMyIdp(req, res) {
  const sId = req.body?.id;
  console.log(sId)

  const id = Number(sId);

  if (Number.isNaN(id) || !id) {
    return res.status(403).json({ message: "Some error occured!" });
  }

  const _id = req.body._id;

  try {
    const event = await Event.findOne({ eventId: id });

    if (!event) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid id, event not found!" });
    }
    
    if (!event.matchId || !event.matchPass) {
        return res
          .status(403)
          .json({ status: false, message: "Event has not started yet!" });
    }

    const matchId = event.matchId;
    const matchPass = event.matchPass;

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res
        .status(200)
        .json({ status: true, id: matchId, pass: matchPass });
    } else {

      const wallet = (await User.findById(_id)).wallet;

      return res
        .status(200)
        .render("my-games", { wallet, id: matchId, pass: matchPass });
    }
  } catch (err) {
    console.log("Error:", err);
  }
}

module.exports = { handleGetGames, handleGetFilteredGames, handleGetMyGames, handleGetMyIdp };
