const database = require('./database')
const bot = require('../bot')

const isISSAround = async () => {

    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    
    const coordinates = await database.selectAllRows('aLat, aLong, bLat, bLong', 'coordinates')
    if(coordinates.length === 0){
        return
    }


    let lat = locationLine[0].latitude
    let long = locationLine[0].longitude

    if(Number(lat) < coordinates[0].bLat) {}
    else if (Number(lat) > Number(coordinates[0].aLat)){} 
    else if (Number(long) < Number(coordinate[0].aLong)){} 
    else if (Number(long) > Number(coordinate[0].bLong)){}
    else {
        const ruser = await database.selectAllRows('rowid, chatId, userId', 'registered')
        ruser.map(user => {
            bot.telegram.sendMessage(user.userId, `Hey mate, amazing news! The ISS is in your area. Check out this link for more details: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station/Where_is_the_International_Space_Station ! Cheers, Steven! `)
        })
    }
  }


  module.exports = {isISSAround}