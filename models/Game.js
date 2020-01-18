const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    counter: Number
})

gameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game