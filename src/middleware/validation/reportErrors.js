const { validationResult } = require("express-validator");
const CustomError = require("../../utils/customError");

module.exports = 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new CustomError(
        400,
        errors.array()[0].msg || "Validation Error"
      ));
    }
    next();
  };
