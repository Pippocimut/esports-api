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

describe("Integration Testing: Matchup Routes", function () {
  this.timeout(10000);
  let player1;
  let player2;

  before(async () => {
    await mongoose.disconnect();
    // Connect to MongoDB for the tests
    await mongoose.connect(
      process.env.TESTING_DB_URI || "mongodb://localhost/esports"
    );
    Matchup.collection.drop();
    player1 = await Player.create({ username: "player1" });
    player2 = await Player.create({ username: "player2" });
    await Ranking.create({ player: player1._id });
    await Ranking.create({ player: player2._id });
  });
  describe("GET /matchup", () => {
    it("should get all matchups from storage and populate them with just username", async () => {
      const res = await request(app).get("/matchup");
      expect(res.status).to.equal(200);
    });
  });
  describe("GET /matchup/:id", () => {
    it("should return a single matchup and populate it with its players - expected to succeed", async () => {
      const matchup = await Matchup.create({
        player1: {
          id: player1._id,
        },
        player2: {
          id: player2._id,
        },
        game : "game",
        date: "2029-10-10 12:00:00",

      });
      const res = await request(app).get(`/matchup/${matchup._id}`);
      expect(res.status).to.equal(200);
    });
    it("should return a 404 error if the matchup is not found", async () => {
      const res = await request(app).get(`/matchup/6654629e30e18d4d8647b478`);
      expect(res.status).to.equal(404);
    });
  });
  describe("POST /matchup", () => {
    it("should record a matchup and return a matchup ID - expected to succeed", async () => {
      await Matchup.collection.drop();
      const matchupData = {
        player1: player1._id,
        player2: player2._id,
        game : "game",
        date: "2029-10-10 12:00:00"
      };

      const res = await request(app).post("/matchup").send(matchupData);
      expect(res.status).to.equal(201);
    });
    it("should return a 404 error if the player is not found", async () => {
      await Matchup.collection.drop();
      const matchupData = {
        player1: "player1",
        player2: "player3",
        game : "game",
        date: "2029-10-10 12:00:00"
      };
      const res = await request(app).post("/matchup").send(matchupData);
      expect(res.status).to.equal(404);
    });
    it("should return a 409 error if the matchup already exists", async () => {
      await Matchup.collection.drop();
      const matchupData = {
        player1: player1._id,
        player2: player2._id,
        game : "game",
        date: "2029-10-10 12:00:00"
      };

      await request(app).post("/matchup").send(matchupData);
      const res = await request(app).post("/matchup").send(matchupData);
      expect(res.status).to.equal(409);
    });
    /* 
  it("should cancel a matchup - expected to succeed", async () => {
    const matchup = await Matchup.create({ status: "pending" });

    const res = await request(app).put(`/matchups/${matchup._id}/cancel`);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Matchup Cancelled");

    const updatedMatchup = await Matchup.findById(matchup._id);
    expect(updatedMatchup.status).to.equal("cancelled");
  });

  it("should return a single matchup and populate it with its players - expected to succeed", async () => {
    const matchup = await Matchup.create({
      player1: "player1",
      player2: "player2",
    });

    const res = await request(app).get(`/matchups/${matchup._id}`);

    expect(res.status).to.equal(200);
    expect(res.body.matchup.player1).to.be.a("string");
    expect(res.body.matchup.player2).to.be.a("string");
  });
*/
  });
  describe("POST /matchup/:id/outcome", () => {
    it("should record an outcome for a matchup - expected to succeed", async () => {
      const matchup = await Matchup.create({
        player1: {
          id:player1._id
        },
        player2: {
          id:player2._id
        },
        game : "game",
        date: "2029-10-10 12:00:00"
      });

      const outcomeData = {
        player1Score: 2,
        player2Score: 1,
      };
      const res = await request(app)
        .post(`/matchup/${matchup._id}/outcome`)
        .send(outcomeData);

      const player1Ranking = await Ranking.findOne({ player: player1._id });
      const player2Ranking = await Ranking.findOne({ player: player2._id });

      expect(player1Ranking.played).to.equal(1);
      expect(player1Ranking.wins).to.equal(1);
      expect(player2Ranking.played).to.equal(1);
      expect(player2Ranking.losses).to.equal(1);
      expect(res.status).to.equal(200);
    });
    it("should return a 404 error if the matchup is not found", async () => {
      const outcomeData = {
        player1Score: 2,
        player2Score: 1,
      };
      const res = await request(app)
        .post(`/matchup/6654629e30e18d4d8647b478/outcome`)
        .send(outcomeData);
      expect(res.status).to.equal(404);
    });
    it("should return a 404 error if the matchup is found but is not pending", async () => {
      const matchup = await Matchup.create({
        player1: {
          id:player1._id
        },
        player2: {
          id:player2._id
        },
        game : "game",
        date: "2029-10-10 12:00:00",
        status: "completed",
      });

      const outcomeData = {
        player1Score: 2,
        player2Score: 1,
      };
      const res = await request(app)
        .post(`/matchup/${matchup._id}/outcome`)
        .send(outcomeData);
      expect(res.status).to.equal(404);
    }); 

  });
  describe("DELETE /matchup/:id", () => {
      it("should cancel a matchup - expected to succeed", async () => {
        const matchup = await Matchup.create({
          player1: {
            id:player1._id
          },
          player2: {
            id:player2._id
          },
          game : "game",
          date: "2029-10-10 12:00:00",
          status: "pending",
        });
        const res = await request(app).delete(`/matchup/${matchup._id}`);

        expect(res.status).to.equal(200);
        const updatedMatchup = await Matchup.findById(matchup._id);
        expect(updatedMatchup.status).to.equal("cancelled");

      });
      it("should return a 404 error if the matchup is not found", async () => {
        const res = await request(app).delete(`/matchup/6654629e30e18d4d8647b478`);
        expect(res.status).to.equal(404);
      });
      it("should return a 404 error if the matchup is found but not pending", async () => {
        const matchup = await Matchup.create({
          player1: {
            id:player1._id
          },
          player2: {
            id:player2._id
          },
          game : "game",
          date: "2029-10-10 12:00:00",
          status: "completed",
        });
        const res = await request(app).delete(`/matchup/${matchup._id}`);
        expect(res.status).to.equal(404);
      });
  });
  after(async () => {
    await Player.collection.drop();
    await mongoose.disconnect();
  });
});
