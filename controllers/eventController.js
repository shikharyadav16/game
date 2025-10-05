const Event = require("../models/Event");
const User = require("../models/User");

async function handleGetGames(req, res) {
  const { email } = req.user;
  try {

    if (!email) {
      return res.redirect("/login");
    }

    const game = (await User.findOne({ email })).game;

    const games = await Event.find({
      eventType: game,
      eventStatus: "upcoming",
    });

    const user = await User.findOne({ email });
    const wallet = await user.wallet;

    return res.render("games.ejs", { games: games, wallet: wallet });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleGetFilteredGames(req, res) {
  const { size = "solo" } = req.params;
  const { _id } = req.user;

  try {
    const { wallet, game } = await User.findById(_id);

    let games;

    if (size === "all-games") {
      games = await Event.find({
        eventType: game,
      });
    } else {
      games = await Event.find({
        eventType: game,
        eventTeamSize: size,
        eventStatus: "upcoming",
      });
    }

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res.json({ games });
    }

    res.render("games.ejs", { games: games, wallet });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleGetMyGames(req, res) {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    let myEvents = await Event.find({
      _id: { $in: user.registeredArray },
      eventStatus: "upcoming",
    });

    myEvents.forEach((event) => {
      const found = event.eventArray.find(
        (e) => e.owner.toString() === _id.toString()
      );
      if (found) {
        event.slot = found.slot;
      }
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
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleGetMyIdp(req, res) {
  const sId = req.body?.id;

  const id = Number(sId);

  if (Number.isNaN(id) || !id) {
    return res
      .status(403)
      .json({ success: false, message: "Some error occured!" });
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
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function handleGetDetails(req, res) {
  const id = req.body.id;

  try {
    if (Number.isNaN(id) || !id) {
      return res
        .status(403)
        .json({ success: false, message: "Some error occured!" });
    }

    const event = await Event.findOne({ eventId: id });

    if (!event) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid id, event not found!" });
    }

    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.log("Error:", err);
  }
}

module.exports = {
  handleGetGames,
  handleGetFilteredGames,
  handleGetMyGames,
  handleGetMyIdp,
  handleGetDetails,
};
