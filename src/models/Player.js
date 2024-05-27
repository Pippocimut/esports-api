const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  username: {
    type: String,
    required: true
  }
});

playerSchema.statics.findByIdorName = async function(value){
  let player = null;
  if (mongoose.Types.ObjectId.isValid(value)) {
    player = await this.model('Player').findById(value);
  } else {
    player = await this.model('Player').findOne({ username: value });
  }
  return player;
}

module.exports = mongoose.model('Player', playerSchema);