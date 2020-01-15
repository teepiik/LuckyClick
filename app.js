const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
//const gameRouter = require('./controllers/gameRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        logger.info('Database connection to MONGODB.')
    })
    .catch((error) => {
        logger.error('Error connecting to MONGODB: ', error.message)
    })


app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
//app.use('/api/game', gameRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)

app.get('/', (req, res) => {
    res.send('Hello server')
})

module.exports = app