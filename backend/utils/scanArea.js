const database = require('./database')
const bot = require('../bot')

const isISSAround = async () => {

    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    
    const coordinates = await database.selectAllRows('aLat, aLong, bLat, bLong, userId', 'coordinates')
    if(coordinates.length === 0){
        return
    }


    let lat = locationLine[0].latitude
    let long = locationLine[0].longitude

    coordinates.map(coordinate => {
        if(Number(lat) < coordinate.bLat) {}
        else if (Number(lat) > Number(coordinate.aLat)){} 
        else if (Number(long) < Number(coordinate.aLong)){} 
        else if (Number(long) > Number(coordinate.bLong)){}
        else {

            bot.telegram.sendMessage(coordinate.userId, `Hey mate, amazing news! The ISS is in your area. Check out this link for more details: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station/Where_is_the_International_Space_Station ! Cheers, Steven! `)
            /*const ruser = await database.selectAllRows('rowid, chatId, userId', 'registered')
            ruser.map(user => {
                bot.telegram.sendMessage(user.userId, `Hey mate, amazing news! The ISS is in your area. Check out this link for more details: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station/Where_is_the_International_Space_Station ! Cheers, Steven! `)
            })*/
        }
    })

       
  }


  module.exports = {isISSAround}