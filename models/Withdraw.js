const mongoose = require("mongoose");

const withdrawSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    transId: {
        type: String,
        required: true,
        unique: true
    },
    upi: {
        type: String,
        required: true
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

const Withdraw = mongoose.model("withdraw", withdrawSchema);
module.exports = Withdraw;