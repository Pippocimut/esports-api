const { validationResult } = require("express-validator");
const CustomError = require("../../utils/customError");

module.exports = 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new CustomError(
        errors.array()[0].statusCode || 400,
        errors.array()[0].message || "Validation Error"
      ));
    }
    next();
  };
