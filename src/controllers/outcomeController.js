const Matchup = require("../models/Matchup");
const Ranking = require("../models/Ranking");
const CustomError = require("../utils/customError");

//controlls that require playerID

exports.recordOutcome = async (req, res, next) => {
  try {
    const matchupID = req.params.id;
    const matchup = await Matchup.findOne({_id:matchupID,status:"pending"});
    if (!matchup) {
      return next(
        new CustomError(404, "Matchup doesnt exist or is not pending")
      );
    }

    matchup.status = "completed";
    matchup.player1.score = req.body.player1Score;
    matchup.player2.score = req.body.player2Score;

    await matchup.save();
    await exports.updateMatchupRanking(matchup);

    res.status(200).json({
      message: "Matchup Outcome Recorded Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMatchupRanking = async function updateMatchupRanking(matchup) {
  const player1Score = matchup.player1.score;
  const player2Score = matchup.player2.score;

  const player1Ranking = await Ranking.findOne({ player: matchup.player1.id });
  const player2Ranking = await Ranking.findOne({ player: matchup.player2.id });

  updatePlayerRanking(player1Ranking, player1Score, player2Score);
  updatePlayerRanking(player2Ranking, player2Score, player1Score);

  await player1Ranking.save();
  await player2Ranking.save();
}

function updatePlayerRanking(ranking, score1, score2) {
  ranking.played += 1;

  if (score1 > score2) {
    ranking.wins += 1;
  } else if (score1 < score2) {
    ranking.losses += 1;
  } else {
    ranking.ties += 1;
  }
}
