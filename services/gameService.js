const Game = require('../models/Game')

const getPoints = (counter) => {
    if(counter % 500 === 0) {
        // if 500 div 250 points
        return 250
    } else if(counter % 100 === 0) {
        // if 100 div 40 points
        return 40
    } else if(counter % 10 === 0) {
        // if 10 div 5 points
        return 5
    }
    return 0
}

const getClicksToNextWin = (counter) => {
    return 10 - (counter % 10)
}

const getCounter = async () => {
    const game = await Game.findOne({})
    return game.counter
}

const calculateWins = async () => {
    // get counter
    const counter = await getCounter()

    // add one to counter
    const newCounter = { counter: counter + 1 }

    await Game.findOneAndUpdate({}, newCounter)

    // calculate points
    const wins = getPoints(newCounter.counter)

    return wins
}

const calculateClicksToNextWin = async () => {
    try {
        const counter = await getCounter()
        const clicksToNextWin = getClicksToNextWin(counter)
        return clicksToNextWin

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    calculateWins, calculateClicksToNextWin
}