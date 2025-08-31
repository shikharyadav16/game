const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventId: {
        type: Number,
        required: true
    },
    eventName: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
        enum: ["bgmi", "ff"],
        required: true
    },
    eventTeamSize: {
        type: String,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    eventSize: {
        type: Number,
        required: true
    },
    eventKillPrize: {
        type: Number,
        required: true,
    },
    eventPosPrize: {
        type: Number,
        required: true
    },
    eventEntry: {
        type: Number,
        required: true
    },
    eventStatus: {
        type: String,
        enum: ["upcoming", "ended"],
        required: true
    },
    matchId: {
        type: String
    },
    matchPass: {
        type: String
    },
    eventArray: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
}, {
    timestamps: true
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;