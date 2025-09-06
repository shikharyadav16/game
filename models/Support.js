const mongoose = require("mongoose");

const supportSchema = mongoose.Schema({
    text: {
        type: String,
    },
    role: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Support = mongoose.model("support", supportSchema);

module.exports = Support;