const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DB_URI = process.env.DB_URI;

describe("Database Connection Tests", () => {
    it("should connect to the database", function (done) {
        mongoose
            .connect(DB_URI || "mongodb://localhost/esports")
            .then(() => {
                console.log("Connected to MongoDB");
                mongoose.connection.close();
                done();
            })
            .catch((err) => {
                console.log(err);
            });
    });
});