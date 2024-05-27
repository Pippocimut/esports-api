const { expect } = require("chai");
const matchupController = require("../../controllers/matchupController");
const Matchup = require("../../models/Matchup");
const Player = require("../../models/Player");
const dotenv = require("dotenv");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const fs = require("fs");

chai.use(sinonChai);
dotenv.config();

describe("Unit Testing: Matchup Controller", () => {
  let findStub;
  let findOneStub;
  let saveStub;
  let mockMatchups;
  let mockMatchup;
  let findByIdStub;
  let res;
  beforeEach(() => {
    mockMatchups = JSON.parse(
      fs.readFileSync(
        "./src/test/data/fetching-data/populated-matchups.json",
        "utf8"
      )
    );
    mockMatchup = JSON.parse(
      fs.readFileSync(
        "./src/test/data/fetching-data/populated-matchup.json",
        "utf8"
      )
    );
    //default res
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });
  describe("Test regarding fetching all matchups", () => {
    it("should get all matchups from storage and populate them with just username", async function () {
      findStub = sinon.stub(Matchup, "find").returns({
        populate: () => Promise.resolve(mockMatchups),
      });

      await matchupController.getAllMatchups({}, res, () => {});

      sinon.assert.calledWith(res.status, 200);
      const response = res.json.getCall(0).args[0];
      expect(response.matchups).to.be.an("array");
      response.matchups.forEach((matchup) => {
        expect(matchup.player1).to.be.a("string");
        expect(matchup.player2).to.be.a("string");
      });
    });
    it("should properly handle errors during validation", async function () {
      findStub = sinon.stub(Matchup, "find").returns({
        populate: () => Promise.resolve(new Error("Error")),
      });

      const nextSpy = sinon.spy();
      await matchupController.recordMatchup({}, {}, nextSpy);

      sinon.assert.calledOnce(nextSpy);
    });
  });
  describe("Tests regarding recording matchups", () => {
    it("Should record a matchup and return a matchup ID - expected to succeed", function (done) {
      findOneStub = sinon.stub(Player, "findOne").resolves({ _id: 1 });
      saveStub = sinon.stub(Matchup.prototype, "save").resolves();

      const req = {
        body: {
          player1: "player1",
          player2: "player2",
          date: "2026-10-10 12:00:00",
          game: "game",
        },
      };
      const json = function (data) {
        expect(data.message).to.equal("Matchup Recorded");
        expect(data.matchupID).to.be.a("string");
      };

      const res = {
        status: function (code) {
          expect(code).to.equal(201);
          return {
            json: json,
          };
        },
      };

      matchupController.recordMatchup(req, res, () => {});
      done();
    });
    it("Should properly handle errors during validation - expected to fail", function () {
      findOneStub = sinon.stub(Player, "findOne").resolves(null);
      saveStub = sinon.stub(Matchup.prototype, "save").throws("Error");

      const nextSpy = sinon.spy();
      matchupController.recordMatchup({}, {}, nextSpy);

      expect(nextSpy).to.have.been.calledOnce;
    });
  });
  describe("Tests regarding cancelling matchups", () => {
    it("should cancel a matchup - expected to succeed", async function () {
      const mockMatchup = { status: "pending", save: sinon.stub().resolves() };
      findByIdStub = sinon.stub(Matchup, "findById").resolves(mockMatchup);
      const req = {
        params: {
          id: "1",
        },
      };

      const res = {
        status: function (code) {
          expect(code).to.equal(201);
          return {
            json: () => {},
          };
        },
      };
      //I want to check the status of the matchup before and after the cancelation

      await matchupController.cancelMatchup(req, res, () => {});

      expect(mockMatchup.status).to.equal("cancelled");
      expect(mockMatchup.save).to.have.been.calledOnce;
    });

    it("Should properly handle errors during validation - expected to fail", function () {
      findByIdStub = sinon
        .stub(Matchup, "findById")
        .resolves({ status: "pending" });
      saveStub = sinon.stub(Matchup.prototype, "save").throws("Error");

      const nextSpy = sinon.spy();
      matchupController.cancelMatchup({}, {}, nextSpy);

      expect(nextSpy).to.have.been.calledOnce;
    });
  });
  describe("Tests regarding fetching a single matchup", () => {

    it("should return a single matchup and populate it with its players - expected to succeed", async function () {

      findByIdStub = sinon.stub(Matchup, "findById").returns({
        populate: () => Promise.resolve(mockMatchup),
      });
      const req = {
        params: {
          id: "1",
        },
      };

      const json = function (data) {
        expect(data.matchup.player1).to.be.a("string");
        expect(data.matchup.player2).to.be.a("string");
      };

      const res = {
        status: function (code) {
          expect(code).to.equal(200);
          return {
            json: json,
          };
        },
      };

      await matchupController.getMatchup(req, res, () => {});
    });

    it("Should properly handle errors during validation - expected to fail", function () {
      findByIdStub = sinon
        .stub(Matchup, "findById")
        .returns({ populate: () => Promise.reject("Error") });

      const nextSpy = sinon.spy();
      matchupController.getMatchup({}, {}, nextSpy);

      expect(nextSpy).to.have.been.calledOnce;
    });
  });
  afterEach(() => {
    if (findByIdStub) findByIdStub.restore();
    if (findStub) findStub.restore();
    if (findOneStub) findOneStub.restore();
    if (saveStub) saveStub.restore();
  });
});
