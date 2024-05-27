const router = require("express").Router();
const { body,param } = require("express-validator");
const matchupController = require("../controllers/matchupController");
const outcomeController = require("../controllers/outcomeController");
const reportErrors= require("../middleware/validation/reportErrors");
const matchupValidation = require("../middleware/validation/matchup");

router.get("/", matchupController.getAllMatchups);

/* router.get(
  "/matchups/:player",
  playerValidation.getPlayerCheck,
  validationErrorCheck,
  matchupController.getPlayerMatchups
); */

router
  .route(
    "/:id",
    param("id")
    .isMongoId()
    .withMessage("ID must be a valid MongoDB ID"),
    reportErrors
  )
  .get(matchupController.getMatchup)
  .delete(matchupController.cancelMatchup);

router.post(
  "/",
  matchupValidation.recordMatchupChecks,
  reportErrors,
  matchupController.recordMatchup
);

router.post(
  "/:id/outcome",
  param("id")
    .isMongoId()
    .withMessage("ID must be a valid MongoDB ID"),
    reportErrors,
  outcomeController.recordOutcome
);

module.exports = router;
