const mongoose = require("mongoose");

const supportSchema = mongoose.Schema({
    text: {
        type: String,
    },
    role: {
        type: String
    }
}, {
    timestamps: true
})

const Support = mongoose.model("support", supportSchema);

module.exports = Support;