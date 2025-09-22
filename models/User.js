const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    profileImage: {
        type: String,
        default: "profile-1"
    },
    username: {
        type: String
    },
    ign: {
        type: String,
        required: true
    },
    upi: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone:{
        type: Number,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    game: {
        type: String,
        required: true,
        enum: ["bgmi", "ff"],
        default: "bgmi"
    },
    wallet: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ["active", "banned"],
        default: "active"
    },
    totalWin: {
        type: Number,
        default: 0
    },
    maxWin: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            transId: { type: String, required: true},
            referenceId: { type: String },
            type: { type: String, enum: ["credit", "debit"], required: true },
            source: { type: String, required: true, enum: ["topup", "event_entry", "withdraw", "event_prize"] },
            amount: { type: Number, required: true },
            status: { type: String, enum: ["SUCCESS", "PENDING", "FAILED"], default: "PENDING" },
            date: { type: Date, default: Date.now }
        }
    ],
    registeredArray: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'events'
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model("users", userSchema);
module.exports = User;