
const express = require('express')
const database = require('./utils/database')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')
const scheduler = require('./scheduler')

database.checkDatabase()

//scheduler.locationScheduler
scheduler.astronomyScheduler
app.use(bodyparser.json())
app.use(cors())
app.use(express.static('build'))


/*app.get('/api/iss/coordinates', async (request, response) => {

    const coordinates = await database.selectAllRows('aLat, aLong, bLat, bLong, userId', 'coordinates')
    if(coordinates.length !== 0){
        response.status(200).json(coordinates[0])
    }else{
        response.status(500)
    }

})*/


/*app.post('/api/iss/coordinates', async (request, response) => {

    const data = request.body
    const coordinates = await database.selectAllRows('aLat,aLong, bLat, bLong', 'coordinates')
    if(coordinates.length !== 0){
        await database.updateById('coordinates', 'aLat = ?, aLong = ?, bLat = ?, bLong = ?', [data.coordinateA.latitude, data.coordinateA.longitude, data.coordinateB.latitude, data.coordinateB.longitude, 1])
    }else{
        await database.insertRow('coordinates', '(null, ?, ?, ?, ?)', [data.coordinateA.latitude, data.coordinateA.longitude, data.coordinateB.latitude, data.coordinateB.longitude])
    }
    response.status(200)
})*/


app.get('/api/iss', async (request, response) => {

   
    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    if(locationLine.length === 0){
        response.status(500)
    }else{
        response.status(200).json(locationLine[0])   
    }
})

app.listen(3002, () => {
    console.log('Start listening on port 3002')
})
    
