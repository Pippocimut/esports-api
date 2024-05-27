const { expect } = require("chai");
const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const Matchup = require("../../models/Matchup");

chai.use(sinonChai);
dotenv.config();

describe("Integration Testing: Matchup Routes", function () {
  this.timeout(10000);

  before(async () => {
    await mongoose.disconnect();
    // Connect to MongoDB for the tests
    await mongoose.connect(
      process.env.TESTING_DB_URI || "mongodb://localhost/esports"
    );

    Matchup.collection.drop();
  });

  it("should get all matchups from storage and populate them with just username", async () => {
    const res = await request(app).get("/matchups");
    expect(res.status).to.equal(200);
    expect(res.body.matchups).to.be.an("array");
    expect(res.body.message).to.equal("All Matchups");
    res.body.matchups.forEach((matchup) => {
      expect(matchup.player1).to.be.a("string");
      expect(matchup.player2).to.be.a("string");
    });
  });

  it("should record a matchup and return a matchup ID - expected to succeed", async () => {

    const matchupData = {
      player1: "player1",
      player2: "player2",
      date: "2029-10-10 12:00:00",
      game: "game",
    };

    const res = await request(app).post("/matchup").send(matchupData);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("Matchup Recorded Successfully");
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
  after(async () => {
    await mongoose.disconnect();
  });
});
