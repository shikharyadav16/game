const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    transId: {
        type: String,
        required: true,
        unique: true
    },
    referenceId: {
        type: String
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    source: {
        type: String,
        required: true,
        enum: ["topup", "event_entry", "withdraw", "event_prize"]
    },
    amount: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["SUCCESS", "PENDING", "FAILED"]
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model("transactions", walletSchema);
module.exports = Wallet;