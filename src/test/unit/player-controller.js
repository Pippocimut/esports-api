const { expect } = require("chai");
const playerController = require("../../controllers/playerController");
const Ranking = require("../../models/Ranking");
const Player = require("../../models/Player");
const dotenv = require("dotenv");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
const fs = require("fs");

chai.use(sinonChai);
dotenv.config();

describe("Unit Testing: Player Controller", () => {
  let findStub;
  let findOneStub;
  let saveStub;
  let saveRankingStub;
  let mockPlayers;
  let mockPlayer;
  let findByIdStub;
  let res;
  beforeEach(() => {
    mockPlayers = JSON.parse(
      fs.readFileSync("./src/test/data/fetching-data/players.json", "utf8")
    );
    mockPlayer = JSON.parse(
      fs.readFileSync("./src/test/data/fetching-data/player.json", "utf8")
    );
    //default res
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });
  describe("Test regarding fetching all players", () => {
    it("should get all players from storage", async function () {
      findStub = sinon.stub(Player, "find").resolves(mockPlayers);

      await playerController.getAllPlayers({}, res, () => {});

      expect(res.status).to.have.been.calledWith(200);
      const response = res.json.getCall(0).args[0];
      expect(response.players).to.be.an("array");
      response.players.forEach((player) => {
        expect(player.username).to.be.a("string");
      });
    });
    it("should properly handle errors during validation", async function () {
      findStub = sinon.stub(Player, "find").returns({
        populate: () => Promise.resolve(new Error("Error")),
      });

      const nextSpy = sinon.spy();
      await playerController.getAllPlayers({}, {}, nextSpy);

      sinon.assert.calledOnce(nextSpy);
    });
  });
  describe("Tests regarding registering players", () => {
    it("Should record a matchup and return a matchup ID - expected to succeed", async function () {
      findOneStub = sinon.stub(Player, "findOne").resolves({ _id: 1 });
      saveStub = sinon.stub(Player.prototype, "save").resolves();
      saveRankingStub = sinon.stub(Ranking.prototype, "save").resolves();
      try{
        Player.deleteOne({ username: "test" });
      }catch(e){
        console.log(e);
      }
      const req = {
        body: {
          username: "test",
        },
      };

      await playerController.registerPlayer(req, res, () => {});

      expect(saveStub).to.have.been.calledOnce;
      expect(saveRankingStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(201);
    });

    it("Should properly handle errors during validation - expected to fail", function () {
      saveStub = sinon.stub(Player.prototype, "save").throws("Error");
      const nextSpy = sinon.spy();
      playerController.registerPlayer({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
    });
  });
  describe("Tests regarding fetching a single player", () => {
    it("should return a single matchup and populate it with its players - expected to succeed", async function () {
      findByIdStub = sinon.stub(Player, "findByIdorName").resolves(mockPlayer);

      req = {
        params: {
          id: "1",
        },
      };

      await playerController.getPlayer(req, res, () => {});

      expect(res.status).to.have.been.calledWith(200);

      response = res.json.getCall(0).args[0];
      expect(response.player).to.be.equal(mockPlayer);
    });

    it("Should properly handle errors during validation - expected to fail", function () {
      findByIdStub = sinon
        .stub(Player, "findById")
        .resolves(null);

      const nextSpy = sinon.spy();
      playerController.getPlayer({}, {}, nextSpy);

      expect(nextSpy).to.have.been.calledOnce;
    });
  });
  afterEach(() => {
    if (findByIdStub) findByIdStub.restore();
    if (findStub) findStub.restore();
    if (findOneStub) findOneStub.restore();
    if (saveStub) saveStub.restore();
    if (saveRankingStub) saveRankingStub.restore();
  });
});
