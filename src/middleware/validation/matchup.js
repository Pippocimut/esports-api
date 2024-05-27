const { body } = require("express-validator");
const CustomError = require("../../utils/customError");

exports.recordMatchupChecks = [
  body("player1").isString().notEmpty(),
  body("player2").isString().notEmpty(),
  body("date").isString().notEmpty(),
  body("game").isString().notEmpty(),
  body("date")
    .custom((value) => !isNaN(Date.parse(value)))
    .withMessage("Date must be a valid date string"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date string"),
  body("date").custom((value, { req }) => {
    const date = new Date(value);
    if (date < new Date()) {
      throw new CustomError(401, "Date cannot be in the past");
    }
    return true;
  })
];



