const database = require('./utils/database')


const sendLatestAstronomyData = async (userId) => {
    const bot = require('./bot')

    const astronomyData = await database.selectAllRows('*', 'astronomy')

    if(astronomyData.length !== 0){
        bot.telegram.sendMessage(userId, `Hey, guess what I got here? Your astronomy picture of the day! Enjoy, Steven!`)
        bot.telegram.sendMessage(userId, `${astronomyData[astronomyData.length - 1].title}`)
        bot.telegram.sendMessage(userId, `${astronomyData[astronomyData.length - 1].explanation}
                                            ${astronomyData[astronomyData.length - 1].url}`)
    }
}



module.exports = {sendLatestAstronomyData}