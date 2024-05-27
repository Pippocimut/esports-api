const { expect } = require("chai");
const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const Player = require("../../models/Player");
const Ranking = require("../../models/Ranking");

chai.use(sinonChai);
dotenv.config();

describe("Integration Testing: Leaderboard Routes", function () {
  this.timeout(10000);
  let player1;
  let player2;

  before(async () => {
    await mongoose.disconnect();
    // Connect to MongoDB for the tests
    await mongoose.connect(
      process.env.TESTING_DB_URI || "mongodb://localhost/esports"
    );
    player1 = await Player.create({ username: "player1" });
    player2 = await Player.create({ username: "player2" });
    await Ranking.create({ player: player1._id });
    await Ranking.create({ player: player2._id });
  });
  describe("GET /leaderboard", () => {
    it("should get the leaderboard with all users", async () => {
      const res = await request(app).get("/leaderboard");
      expect(res.status).to.equal(200);
    });
  });
  after(async () => {
    Player.collection.drop();
    Ranking.collection.drop();
    await mongoose.disconnect();
  });
});
