const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully!");
    } catch(err) {
        console.log("Error", err);
        process.exit(1);
    }
}

module.exports = { connectToDb }