const jwt = require("jsonwebtoken");

const secureKey = "A7f9L2qX8rW3";

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
