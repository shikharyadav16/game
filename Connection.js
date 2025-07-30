const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/nextscrimz");
        console.log("Database connected Successfully!");
    } catch(err) {
        console.log("Error", err);
        process.exit(1);
    }
}

module.exports = { connectToDb }