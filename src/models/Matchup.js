const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchupSchema = new Schema({
  player1: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    score: {
      type: Number,
      required: false,
    },
  },
  player2: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    score: {
      type: Number,
      required: false,
    },
  },

  date: {
    type: Date,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    required: true,
    default: "pending",
  },
});

module.exports = mongoose.model("Matchup", matchupSchema);
