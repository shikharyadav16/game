const mongoose = require("mongoose");

const resultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    eventId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String
    },
    game: {
      type: String,
      enum: ["bgmi", "ff"],
      required: true
    },
    size: {
      type: String,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    prizeEarned: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["WON", "LOST"],
      default: "WON",
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("results", resultSchema);

module.exports = Result;
