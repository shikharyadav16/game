const jwt = require("jsonwebtoken");
require("dotenv").config();

const secureKey = process.env.JSON_KEY;

function setUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        game: user.userGame,
        ign: user.userIgn
    }
    return jwt.sign(payload, secureKey);
}

function getUser(token) {
    if (!token) {
        return null;
    }
    try {
        const user = jwt.verify(token, secureKey);
        return user;
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser };
