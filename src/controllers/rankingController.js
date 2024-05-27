const Ranking = require("../models/Ranking");

exports.getLeaderboard = async (req, res,next) => {
  try {
    let leaderboard = await Ranking.find({ played: { $ne: 0 } })
      .populate("player")
      .sort({
        wins: -1,
        ties: -1,
        losses: 1,
        played: -1,
      });
    leaderboard = leaderboard.map((ranking) => {
      if (ranking.player) {
        return {
          player: ranking.player.username,
          wins: ranking.wins,
          ties: ranking.ties,
          losses: ranking.losses,
          played: ranking.played
        };
      }
    });

    res.json({
      message: "Leaderboard Stat",
      leaderboard: leaderboard,
    });
  } catch (err) {
    next(err);
  }
};
