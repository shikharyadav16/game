const User = require("../models/User");

async function handleGetLeaderboard(req, res) {
  const { _id } = req.user;

  try {
    const wallet = (await User.findById(_id)).wallet;

    const users = await User.find({}).sort({ totalWin: -1 }).limit(20);

    let usersList = [];

    users.forEach((user) => {
      let matchesPlayed = user.registeredArray.length;
      let playload = {
        ign: user.ign,
        profileImage: user.profileImage,
        game: user.game,
        earnings: user.totalWin,
        maxWin: user.maxWin,
        matchesPlayed: matchesPlayed,
        status: user.status,
      };

      usersList.push(playload);
    });

    const dummyUsers = [
      {
        ign: "Phantom",
        game: "bgmi",
        profileImage: "profile-2",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-3",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-4",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-5",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Reaper",
        game: "bgmi",
        profileImage: "profile-6",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
    ];

    while (usersList.length < 3) {
      usersList.push(dummyUsers[usersList.length]);
    }

    return res.render("leaderboard.ejs", { wallet, usersList });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({success: false, message: err.message})
  }
}

async function handleGetFilteredLeadeBoard(req, res) {
  const { game } = req.params;

  try {
    let query = {};

    if (game === "bgmi") {
      query.game = "bgmi";
    } else if (game === "ff") {
      query.game = "ff";
    } else if (game === "all-games"){ } else {
        return res.status(404).json({success: false, message: "Invalid game type" });
    }

    const users = await User.find(query)
      .sort({ totalWin: -1 })
      .limit(20);

    // console.log(u)

    let usersList = [];

    users.forEach((user) => {
      let matchesPlayed = user.registeredArray.length;
      let playload = {
        ign: user.ign,
        profileImage: user.profileImage,
        game: user.game,
        earnings: user.totalWin,
        maxWin: user.maxWin,
        matchesPlayed: matchesPlayed,
        status: user.status,
      };

      usersList.push(playload);
    });

    const dummyUsers = [
      {
        ign: "Phantom",
        game: "bgmi",
        profileImage: "profile-2",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-3",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-4",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Valkyrie",
        game: "ff",
        profileImage: "profile-5",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
      {
        ign: "Reaper",
        game: "bgmi",
        profileImage: "profile-6",
        earnings: 0,
        maxWin: 0,
        matchesPlayed: 0,
        status: "active",
      },
    ];

    while (usersList.length < 3) {
      usersList.push(dummyUsers[usersList.length]);
    }

    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      return res.json({ usersList });
    }

    return res.render("leaderboard.ejs", { usersList });

  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({success: false, message: err.message})
  }
}

module.exports = { handleGetLeaderboard, handleGetFilteredLeadeBoard };
