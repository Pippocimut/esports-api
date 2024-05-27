# Esports tournament system

This is a API for a e-sport platform that allow players to be registered, put in matchups, record the outcome of matchups and print a leaderboard

## Getting started

### Prerequisites

- Download Node.js and npm here: <https://nodejs.org/en/>
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### Installation

1. `npm install`

2. Create a .env file in root project folder

    ```text
    DB_URI={your databse connection string}
    PORT={preferred port}
    TESTING_DB_URI={your databse connection string, you can use DB_URI if don't have a separate testing DB}
    ```  

3. `npm start`

4. <http://localhost:yourport> is the url of the app, access it with any REST client exp. [Postman](https://www.postman.com/downloads/).

### Testing

The tests are implemented in `src/test` using [Mocha](https://github.com/mochajs/mocha). `npm test` to run the test files.

## API Routes

### Matchup Routes

- `GET /matchup`: Fetches all matchups.
- `POST /matchup`: Records a new matchup and returns its ID. This route expects `game:string`, `date:datetime`, `player1: string/MongoId`, `player2: string/MongoId` in the request body.
- `GET /matchup/:id`: Fetches a specific matchup by its MongoDB ID.
- `DELETE /matchup/:id`: Cancels a specific matchup by its MongoDB ID.
- `POST /matchup/:id/outcome`: Records the outcome of a specific matchup by its MongoDB ID. This route expects `player1Score: number`, `player2Score:number` in the request body.

### Player Routes

- `GET /player`: Fetches all players.
- `POST /player`: Registers a new player. This route expects a `username` in the request body.
- `GET /player/:id`: Fetches a specific player by their MongoDB ID.

### Ranking Routes

- `GET /ranking`: Fetches the leaderboard.

## Built with

- [Express.js](https://github.com/expressjs/express) - Node.js web application framework
- [mongoose](https://github.com/Automattic/mongoose) - MongoDB object modeling for Node.js
- [Mocha](https://github.com/mochajs/mocha) - API and database testing
- [chai](https://github.com/chaijs/chai) - An assertion library for Node.js
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a `.env` file
- [express-validator](https://github.com/express-validator/express-validator) - An Express middleware for server-side data validation
- [mongodb](https://github.com/mongodb/node-mongodb-native) - The official MongoDB driver for Node.js
- [sinon](https://github.com/sinonjs/sinon) - Standalone test spies, stubs and mocks for JavaScript
- [sinon-chai](https://github.com/domenic/sinon-chai) - Extends Chai with assertions for the Sinon.JS mocking framework
- [supertest](https://github.com/visionmedia/supertest) - A high-level abstraction for testing HTTP

## Author

- Teodoro Capacchione

## License

This project is licensed under the terms of the [MIT license](./LICENCE.txt).
