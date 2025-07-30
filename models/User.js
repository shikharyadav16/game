const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    ign: {
        type: String,
        required: true,
    },
    upi: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    registeredArray: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ]
});

const User = mongoose.model("users", userSchema);

module.exports = User;