const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    eventId: {
      type: Number,
      unique: true,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventImage: {
      type: String,
    },
    eventType: {
      type: String,
      enum: ["bgmi", "ff"],
      required: true,
    },
    eventMap: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const bgmiMaps = ["erangel", "livik", "miramar", "rondo", "sanhok"];
          const ffMaps = [
            "bermuda",
            "purgatory",
            "kalahari",
            "alpine",
            "nexterra",
            "solara",
          ];

          if (this.eventType === "bgmi") {
            return bgmiMaps.includes(value);
          } else if (this.eventType === "ff") {
            return ffMaps.includes(value);
          }
          return false;
        },
        message: (props) =>
          `Invalid map "${props.value}" for event type "${props.instance.eventType}"`,
      },
    },
    eventTeamSize: {
      type: String,
      required: true,
      enum: ["solo", "duo", "squad"],
    },
    eventTime: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventSize: {
      type: Number,
      required: true,
    },
    eventKillPrize: {
      type: Number,
      required: true,
    },
    eventPosPrize: [
      {
        position: {
          type: Number,
        },
        prize: {
          type: Number,
        },
      },
    ],
    eventEntry: {
      type: Number,
      required: true,
    },
    eventStatus: {
      type: String,
      enum: ["upcoming", "ended"],
      default: "upcoming",
      required: true,
    },
    matchId: {
      type: String,
    },
    matchPass: {
      type: String,
    },
    eventArray: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        team: {
          type: String,
        },
        players: [
          {
            type: String,
          },
        ],
        slot: {
          type: Number,
        },
      },
    ],
    result: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
