const { body } = require("express-validator");

exports.recordMatchupChecks = [
  body("player1").isString().notEmpty().withMessage("Player 1 must be a string"),
  body("player2").isString().notEmpty().withMessage("Player 2 must be a string"),
  body("date").isString().notEmpty().withMessage("Date must be a string"),
  body("game").isString().notEmpty().withMessage("Game must be a string"),
  body("date")
    .custom((value) => !isNaN(Date.parse(value)))
    .withMessage("Date must be a valid date string"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date string"),
  body("date")
    .custom((value) => new Date(value) >= new Date())
    .withMessage("Date must be in the future"),
];
