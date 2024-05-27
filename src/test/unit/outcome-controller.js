const { expect } = require("chai");
const outcomeController = require("../../controllers/outcomeController");
const Matchup = require("../../models/Matchup");
const Player = require("../../models/Player");
const dotenv = require("dotenv");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const fs = require("fs");
const { param } = require("express-validator");

chai.use(sinonChai);
dotenv.config();

describe("Unit Testing: Outcome Controller", () => {
  let findStub;
  let findOneStub;
  let saveStub;
  let findByIdStub;
  let updateMatchupRankingStub;
  let mockMatchupPending;
  let res;
  beforeEach(() => {
    //default res
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    mockMatchupPending =new Matchup(JSON.parse(
      fs.readFileSync("./src/test/data/matchup-pending.json", "utf8")
    ));
  });
  describe("Test regarding recording the outcome of a Matchup", () => {
    it("should record a matchup outcome and set the matchup to completed", async function () {

      findOneStub = sinon.stub(Matchup, "findOne").resolves(mockMatchupPending);
      updateMatchupRankingStub = sinon.stub(outcomeController, "updateMatchupRanking").resolves();
      saveStub = sinon.stub(Matchup.prototype, "save").resolves();

      req = {
        params: {
          id: "123",
        },
        body: {
          player1Score: 2,
          player2Score: 1,
        },
      };

      await outcomeController.recordOutcome(req, res, ()=>{});
  
      expect(res.status).to.have.been.calledWith(200);
      expect(mockMatchupPending.status).to.equal("completed");
    });
    it("should properly handle errors during validation", async function () {
      findOneStub = sinon.stub(Matchup, "findOne").resolves(null);
      const nextSpy = sinon.spy();
      await outcomeController.recordOutcome({}, {}, nextSpy);
      sinon.assert.calledOnce(nextSpy);
    });
  });
  afterEach(() => {
    if (findStub) {
      findStub.restore();
    }
    if (findOneStub) {
      findOneStub.restore();
    }
    if (saveStub) {
      saveStub.restore();
    }
    if (findByIdStub) {
      findByIdStub.restore();
    }
    if (updateMatchupRankingStub) {
      updateMatchupRankingStub.restore();
    }
  });
});
