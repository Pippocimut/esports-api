const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rankingSchema = new Schema({
  player : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
    wins : {
        type: Number,
        required: true,
        default: 0
    },
    losses : {
        type: Number,
        required: true,
        default: 0
    },
    ties : {
        type: Number,
        required: true,
        default: 0
    },
    played : {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('Ranking', rankingSchema);