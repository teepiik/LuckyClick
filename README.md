# LuckyClick
Lucky Click is small online multiplayer game for programming practice.
Game is playable [HERE](https://luckyclick8.herokuapp.com/). This repository
contains back-end code and production build of the front-end code.
Front-end code can be found [here](https://github.com/teepiik/LuckyClick_Frontend).

## Game Rules
* Every game starts with user having 20 points.
* Every click costs 1 points.
* Every 10th click on server rewards 5 points, every 100th click 40 points
and every 500th click 250 points. Only the highest win is rewarded.
* Players get information after click that how many clicks away is the next win.
* Game ends if player has 0 (or less) points.

## API Documentation
Below is list of endpoints.
* HTTP POST to /api/login - send username and passwordHash to login and to get token.
* HTTP POST to /api/users - send username and password to register a new user.
* HTTP GET to /api/users/newgame/id - Starts a new game for player if id (parameter) matches to database.
* HTTP GET to /api/users/click/id - Registers click and returns results for player if id (parameter) matches to database.
* HTTP GET to /api/users/gamestatus/id - Returns points and clicks to next win for player if id (parameter) matches to database.


## Tech Stack
* Back-end is programmed using Node.js, Express and Mongoose. Database is hosted on MongoDB Atlas.
* Front-end uses React.js, Axios and React-bootstrap.
* ESLint is used for linting.

## Dev Notes
* Game is intented to be played online, but user can also clone this repository and play locally. This needs Node packet manager in order to install dependencies and also to setup environment variables and own database.
* Development is done on computer running Windows OS. This affects some ESLint configurations and dictates to use bcrypjs instead of bcrypt.
* Time available for development has initially been limited, so game has only MVP functionality and robust look.
* Back-end API endpoints could be named / organized more wisely.