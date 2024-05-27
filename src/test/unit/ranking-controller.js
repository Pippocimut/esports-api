const { expect } = require("chai");
const sinon = require("sinon");
const Ranking = require("../../models/Ranking");
const rankingController = require("../../controllers/rankingController");

describe("Unit Testing: Ranking Controller", () => {
  let findStub;
  let populateStub;
  let sortStub;
  let res;

  beforeEach(() => {
    res = {
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    if (findStub) findStub.restore();
    if (populateStub) populateStub.restore();
    if (sortStub) sortStub.restore();
  });

  describe("Test regarding fetching leaderboard", () => {
    it("should fetch leaderboard and return sorted rankings", async () => {
      const mockRankings = [
        { player: { username: "user1" }, wins: 5, ties: 2, losses: 3, played: 10 },
        { player: { username: "user2" }, wins: 3, ties: 4, losses: 2, played: 9 },
        { player: { username: "user3" }, wins: 4, ties: 1, losses: 5, played: 10 },
      ];

      findStub = sinon.stub(Ranking, "find").returns({
        populate: () => ({
          sort: () => Promise.resolve(mockRankings),
        }),
      });

      await rankingController.getLeaderboard({}, res,()=>{});

      sinon.assert.calledOnce(res.json);
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal("Leaderboard Stat");
      expect(response.leaderboard).to.deep.equal([
        { player: "user1", wins: 5, ties: 2, losses: 3, played: 10 },
        { player: "user2", wins: 3, ties: 4, losses: 2, played: 9 },
        { player: "user3", wins: 4, ties: 1, losses: 5, played: 10 },
      ]);
    });

    it("should handle error if fetching leaderboard fails", async () => {
      findStub = sinon.stub(Ranking, "find").throws("Error");
      nextSpy = sinon.spy();

      await rankingController.getLeaderboard({}, res,nextSpy);

      sinon.assert.notCalled(res.json);
      sinon.assert.calledOnce(nextSpy);

    });
  });
});