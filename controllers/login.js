const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
    const body = req.body
    const user = await User.findOne({ username: body.username })

    const match = await bcrypt.compare(body.password, user.passwordHash)
    console.log('Is it a match: ')
    console.log(match)

    const isPasswordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && isPasswordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password.'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    const userWithToken = {
        token: token,
        username: user.username,
        id: user._id
    }

    res
        .status(200)
        .send(userWithToken)
})

module.exports = loginRouter