const { expect } = require("chai");
const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const Matchup = require("../../models/Matchup");
const Player = require("../../models/Player");
const Ranking = require("../../models/Ranking");

chai.use(sinonChai);
dotenv.config();

describe("Integration Testing: Player Routes", function () {
  this.timeout(10000);
  let player1;
  let player2;

  before(async () => {
    await mongoose.disconnect();
    // Connect to MongoDB for the tests
    await mongoose.connect(
      process.env.TESTING_DB_URI || "mongodb://localhost/esports"
    );
  });
  describe("GET /players", () => {
    it("should get all players", async () => {
      await Player.create({ username: "player1" });

      const res = await request(app).get("/player");
      expect(res.status).to.equal(200);

    });
  });
  describe("GET /player/:id", () => {
    it("should return a single player - expected to succeed", async () => {
      const player = await Player.create({ username: "player1" });

      const res = await request(app).get(`/player/${player._id}`);
      expect(res.status).to.equal(200);
    });
    it("should return a 404 error if the player is not found", async () => {
      const res = await request(app).get(`/player/6654629e30e18d4d8647b478`);
      expect(res.status).to.equal(404);
    });
  });
  describe("POST /player", () => {
    it("should register a player and create a ranking for them - expected to succeed", async () => {
      await Player.collection.drop();
      await Ranking.collection.drop();
      const playerData = {
        username: "player1"
      };
      const res = await request(app).post("/player").send(playerData);
      const playerRanking = await Ranking.findOne({ player: res.body.player});
      expect(playerRanking).to.not.be.null;
      expect(res.status).to.equal(201);
    });

    it("should return a 409 error if a player with the same username is found", async () => {
      await Player.collection.drop();
      const playerData = {
        username: "player1"
      };
      await request(app).post("/player").send(playerData);
      const res = await request(app).post("/player").send(playerData);
      expect(res.status).to.equal(409);
    });
    
  })

  after(async () => {
    Player.collection.drop();
    Ranking.collection.drop();
    await mongoose.disconnect();
  });
});