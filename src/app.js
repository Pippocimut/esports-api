const express = require("express");
const mongoose = require("mongoose");
const app = express();

const playerRoutes = require("./routes/playerRoutes");
const matchupRoutes = require("./routes/matchupRoutes");
const rankingRoutes = require("./routes/rankingRoutes");

const errorController = require("./controllers/errorController");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/player", playerRoutes);
app.use("/leaderboard", rankingRoutes);
app.use("/matchup", matchupRoutes);

//Returns a custom error if reached
app.use("/", errorController.genericErrorHandler);

connectToDb()
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

function connectToDb(){
  return mongoose.connect(process.env.DB_URI || "mongodb://localhost/esports");
}

module.exports = app;