const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/User')
const gameService = require('../services/gameService')
const jwt = require('jsonwebtoken')

const getToken = req => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

// Base url is set to /api/users
userRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(body.password, salt)

        const user = new User({
            username: body.username,
            passwordHash,
            points: 20
        })

        const savedUser = await user.save()
        res.json(savedUser)

    } catch (exception) {
        next(exception)
    }
})

userRouter.get('/newgame/:id', async (req, res, next) => {
    // Starts new game, gives player 20 points.
    try {
        const token = getToken(req)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if(!token || !decodedToken.id) {
            return res.status(401).json({ error: 'Token missing or invalid.' })
        }

        const updatePlayer = { points: 20 }
        const updatedPlayer = await User.findByIdAndUpdate(decodedToken.id, updatePlayer, { new: true })
        const clicksToWin = await gameService.calculateClicksToNextWin()
        const gameMessage = 'New game started!'

        return res.json({ updatedPlayer, clicksToWin, gameMessage })
    } catch (error) {
        next(error)
    }
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(u => u.toJSON()))
})

// handles click, gives points
userRouter.get('/click/:id', async (req, res, next) => {
    try {
        const token = getToken(req)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if(!token || !decodedToken.id) {
            return res.status(401).json({ error: 'Token missing or invalid.' })
        }

        let player = await User.findById(decodedToken.id)
        // click costs 1 point
        player.points = player.points - 1

        // calculate points with gameService
        const wins = await gameService.calculateWins()

        // update user points to user db
        // Confirm that updates only that one field to DB!!!
        const updatePlayer = { points: player.points + wins }
        const updatedPlayer = await User.findByIdAndUpdate(decodedToken.id, updatePlayer, { new: true })

        // Game message
        let gameMessage = 'No wins, better luck next time.'

        if(updatedPlayer.points < 1) {
            gameMessage = 'Game over, try again!'
        }

        if(wins > 0) {
            gameMessage = `Congratulations! You won ${wins} points.`
        }
        // get game status
        const clicksToWin = await gameService.calculateClicksToNextWin()

        return res.json({ updatedPlayer, clicksToWin, gameMessage })
    } catch(error) {
        next(error)
    }
})

// returns player points and clicks to next win
userRouter.get('/gamestatus/:id', async (req, res, next) => {
    try {
        const player = await User.findById(req.params.id)
        const points = player.points

        const clicksToWin = await gameService.calculateClicksToNextWin()

        return res.json({ points, clicksToWin })
    } catch(error) {
        next(error)
    }
})

module.exports = userRouter