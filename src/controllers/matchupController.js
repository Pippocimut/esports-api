const Matchup = require("../models/Matchup");
const Player = require("../models/Player");
const CustomError = require("../utils/customError");

exports.getAllMatchups = async (req, res, next) => {
  try {
    let matchups = await Matchup.find().populate("player1.id player2.id");

    matchups = matchups.map((matchup) => {
      return {
        ...matchup._doc,
        player1: matchup.player1.id.username,
        player2: matchup.player2.id.username,
      };
    });

    res.status(200).json({
      message: "All Matchups",
      matchups: matchups,
    });
  } catch (err) {
    next(err); // Return the error without custom error
  }
};
exports.recordMatchup = async (req, res, next) => {
  try {
    const player1 = await Player.findByIdorName(req.body.player1);
    const player2 = await Player.findByIdorName(req.body.player2);

    const date = new Date(req.body.date);
    if (!player1 || !player2) {
      return next(new CustomError(404, "Player not found"));
    }

    const conflict = await recordConflictCheck(date, player1._id, player2._id); //old version of the function
    if (conflict) {
      return next(
        new CustomError(
          409,
          "Matchup already exists with these player/s at this time"
        )
      );
    }

    const matchup = new Matchup({
      player1: {
        id: player1._id,
      },
      player2: {
        id: player2._id,
      },
      date: date,
      game: req.body.game,
      status: "pending",
    });

    await matchup.save();
    res.status(201).json({
      message: "Matchup Recorded Successfully",
      matchupID: matchup._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};
async function recordConflictCheck(date, player1Id, player2Id) {
  //Range of time to check for conflicts
  const startDate = new Date(date);
  const endDate = new Date(date);

  const matchup = await Matchup.findOne(
    findQuery(startDate, endDate, player1Id, player2Id)
  );

  return matchup;
}
const findQuery = (startDate, endDate, player1, player2) => {
  return {
    status: { $ne: "cancelled" },
    $or: [
      {
        $and: [
          {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          {
            $or: [{ "player1.id": player1 }, { "player2.id": player1 }],
          },
        ],
      },
      {
        $and: [
          {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          {
            $or: [{ "player1.id": player2 }, { "player2.id": player2 }],
          },
        ],
      },
    ],
  };
};
exports.cancelMatchup = async (req, res, next) => {
  try {
    const matchup = await Matchup.findOneAndUpdate({_id:req.params.id, status:"pending"},{
      $set: {
        status: "cancelled",
      },
    });

    if (!matchup) {
      return next(new CustomError(404, "Matchup not found"));
    }

    res.status(200).json({
      message: "Matchup Cancelled"
    });
  } catch (err) {
    next(err); // Return the error without custom error
  }
};
exports.getMatchup = async (req, res, next) => {
  try {
    const value = req.params.id;
    const matchup = await Matchup.exists({ _id: value }).populate(
      "player1.id player2.id"
    );
    if (!matchup) {
      return next(new CustomError(404, "Matchup doesnt exist"));
    }

    matchup.player1 = matchup.player1.id.username;
    matchup.player2 = matchup.player2.id.username;

    res.status(200).json({
      message: "Matchup",
      matchup: matchup,
    });
  } catch (err) {
    next(err);
  }
};
