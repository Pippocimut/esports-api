const { expect } = require("chai");
const errorController = require("../../controllers/errorController");
const dotenv = require("dotenv");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");

chai.use(sinonChai);
dotenv.config();

describe("Unit Testing: Error Controller", () => {
  let res;
  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });
  describe("Test regarding generic error handler", () => {
    it("should return an error to the user", async function () {
      const statusCode = 404;
      const message = "Not Found";

      await errorController.genericErrorHandler(
        { statusCode, message },
        {},
        res,
        () => {}
      );

      sinon.assert.calledWith(res.status, statusCode);
      const response = res.json.getCall(0).args[0];
      expect(response.message).to.equal(message);
    });
    it("should return a default error to the user if no details are specified ", async function () {
        await errorController.genericErrorHandler(
          {},
          {},
          res,
          () => {}
        );
        sinon.assert.calledWith(res.status, 500);
      });
  });
  
  afterEach(() => {
    sinon.restore();
  });
});
