const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/User')

// Base url is set to /api/users
userRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(body.password, salt)

        const user = new User({
            username: body.username,
            passwordHash,
            points: 0
        })

        const savedUser = await user.save()
        res.json(savedUser)

    } catch (exception) {
        next(exception)
    }
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(u => u.toJSON()))
})

module.exports = userRouter