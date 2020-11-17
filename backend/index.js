
const express = require('express')
const database = require('./utils/database')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const bot = require('./bot')


database.checkDatabase()


app.use(bodyparser.json())
app.use(cors())
app.use(express.static('build'))
app.get('/api/iss/notification', async (request, response) => {

    const ruser = await database.selectAllRows('rowid, chatId, userId', 'registered')
    ruser.map(user => {
        bot.telegram.sendMessage(user.userId, `Hey mate, amazing news. The ISS is in your area. Check out this link: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station/Where_is_the_International_Space_Station ! Cheers, Steven! `)
    })
    response.status(200)
})


app.get('/api/iss/coordinates', async (request, response) => {

    const coordinates = await database.selectAllRows('aLat,aLong, bLat, bLong', 'coordinates')
    if(coordinates.length !== 0){
        response.status(200).json(coordinates[0])
    }else{
        response.status(500)
    }

})


app.post('/api/iss/coordinates', async (request, response) => {

    const data = request.body
    const coordinates = await database.selectAllRows('aLat,aLong, bLat, bLong', 'coordinates')
    if(coordinates.length !== 0){
        await database.updateById('coordinates', 'aLat = ?, aLong = ?, bLat = ?, bLong = ?', [data.coordinateA.latitude, data.coordinateA.longitude, data.coordinateB.latitude, data.coordinateB.longitude, 1])
    }else{
        await database.insertRow('coordinates', '(null, ?, ?, ?, ?)', [data.coordinateA.latitude, data.coordinateA.longitude, data.coordinateB.latitude, data.coordinateB.longitude])
    }
    response.status(200)
})


app.post('/api/iss', async (request, response) => {
    const data = request.body
    console.log(data)
    if(data !== undefined){
        const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
        if(locationLine.length === 0){
            await database.insertRow('location', '(null, ?, ?)', [data.latitude, data.longitude])
        }else{
            await database.updateById('location', 'latitude = ?, longitude = ?', [data.latitude, data.longitude, 1])
        }
    }
    response.status(200).send('All okay')
})

app.listen(3002, () => {
    console.log('Start listening on port 3002')
})
    
