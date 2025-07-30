const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventId: {
        type: Number,
        required: true
    },
    eventColor: {
        type: String,
    },
    eventType: {
        type: String,
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
    eventArray: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;