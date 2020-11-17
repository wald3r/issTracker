
const schedule = require('node-schedule')
const axios = require('axios')
const database = require('./utils/database')
const scanArea = require('./utils/scanArea')


const locationScheduler = schedule.scheduleJob('*/1 * * * *', async () => {
    const response = await axios.get(`http://api.open-notify.org/iss-now.json`)

    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    if(locationLine.length === 0){
        await database.insertRow('location', '(null, ?, ?)', [response.data.iss_position.latitude, response.data.iss_position.longitude])
    }else{
        await database.updateById('location', 'latitude = ?, longitude = ?', [response.data.iss_position.latitude, response.data.iss_position.longitude, 1])
    }
    scanArea.isISSAround()
})


module.exports = { locationScheduler }