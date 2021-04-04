
const schedule = require('node-schedule')
const axios = require('axios')
const database = require('./utils/database')
const scanArea = require('./utils/scanArea')
require('dotenv').config()
const botCommunication  = require('./botCommunication')

//const locationScheduler = schedule.scheduleJob('*/1 * * * *', async () => {
//    const response = await axios.get(`http://api.open-notify.org/iss-now.json`)
//
//    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
//    if(locationLine.length === 0){
//        await database.insertRow('location', '(null, ?, ?)', [response.data.iss_position.latitude, response.data.iss_position.longitude])
//    }else{
//        await database.updateById('location', 'latitude = ?, longitude = ?', [response.data.iss_position.latitude, response.data.iss_position.longitude, 1])
//    }
//    scanArea.isISSAround()
//})


const astronomyScheduler = schedule.scheduleJob('40 10 * * *', async () => {
    console.log('astronomyScheduler: Retrieving picture of the day!')
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.APIKEY}`)
    await database.insertRow('astronomy', '(null, ?, ?, ?, ?, ?, ?)', [response.data.copyright, response.data.date, response.data.explanation, response.data.media_type, response.data.title, response.data.url])

    const registeredUser = await database.selectAllRows('*', 'registered')
    await registeredUser.map(async ruser => {
       await botCommunication.sendLatestAstronomyData(ruser.userId)
    })

})


module.exports = { astronomyScheduler }