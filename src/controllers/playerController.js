const Player = require("../models/Player");
const Ranking = require("../models/Ranking");
const CustomError = require("../utils/customError");

exports.getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.find();

    res.status(200).json({
      message: "All Players",
      players: players,
    });
  } catch (err) {
    next(new CustomError(500, err));
  }
};
exports.getPlayer = async (req, res, next) => {
  try {
    searchValue = req.params.id;
    const player = await Player.findByIdorName(searchValue);
    if (!player) {
      return next(new CustomError(404, "Player doesnt exist"));
    }
    res.status(200).json({
      message: "Player",
      player: player,
    });
  } catch (err) {
    next(new CustomError(500, err));
  }
};
exports.registerPlayer = async (req, res, next) => {
  try {
    const player = new Player({
      username: req.body.username,
    });
    await player.save();

    const ranking = new Ranking({
      player: player._id,
    });
    await ranking.save();

    res.status(201).json({
      message: "Player Registered",
    });
  } catch (err) {
    next(new CustomError(500, err));
  }
};

//Place holders for fufure implementation
/* exports.updatePlayer = async (req, res, next) => {
  try {
    const oldPlayer = await Player.findByIdAndUpdate(req.params.id, req.body);
    await oldPlayer.save();

    res.json({
      message: "Player Updated",
    });
  } catch (err) {
    next(new CustomError(500, err));
  }
};

exports.deletePlayer = async (req, res, next) => {
  try {
    const deletedPlayer = await Player.findById(req.params.id);
    deletedPlayer.username = "[Deleted]";
    await deletedPlayer.save();

    if (!deletedPlayer) {
      return res.status(404).json({
        message: "Player not found",
      });
    }
    const deletedRanking = await Ranking.findOneAndDelete({
      player: req.params.id,
    });
    if (!deletedRanking) {
      return res.status(404).json({
        message: "Ranking not found",
      });
    }

    res.json({
      message: "Player Deleted",
    });
  } catch (err) {
    next(new CustomError(500, err));
  }
}; */
