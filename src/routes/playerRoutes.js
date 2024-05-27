const router = require("express").Router();
const playerController = require("../controllers/playerController");
const reportErrors = require("../middleware/validation/reportErrors");
const { body,param } = require("express-validator");

router
  .route("/")
  .get(playerController.getAllPlayers)
  .post(
    body("username").isString().notEmpty().withMessage("Username is required"),
    reportErrors,
    playerController.registerPlayer
  );

router
  .route("/:id", param("id").isString().notEmpty(), reportErrors)
  .get(playerController.getPlayer)

  //Place holders for future implementation
  /* .patch(
    playerController.updatePlayer
  )
  .delete(playerController.deletePlayer); */

module.exports = router;
