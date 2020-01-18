const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const Game = require('./models/Game')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        logger.info('Database connection to MONGODB.')
    })
    .catch((error) => {
        logger.error('Error connecting to MONGODB: ', error.message)
    })

// init game counter
const initGame = async () => {
    try {
        // remove previous instances
        await Game.deleteMany({})

        const game = new Game({ counter: 0 })
        await game.save()
    } catch(error) {
        logger.error('Error initializing game: ', error.message)
    }
}
initGame()

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)

app.get('/', (req, res) => {
    res.send('Hello server')
})

module.exports = app