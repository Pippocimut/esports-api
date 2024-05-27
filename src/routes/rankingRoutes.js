const router = require('express').Router();
const rankingController = require('../controllers/rankingController');

 
router.route('/')
    .get(rankingController.getLeaderboard)

module.exports = router;