
const express = require('express')
const Telegraf = require('telegraf')
const database = require('./utils/database')
const app = express()
require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN) 

database.checkDatabase()

bot.hears('hi', (ctx) => ctx.reply('Hey there')) 
bot.hears('hello', ctx => ctx.reply(`Hey ${ctx.from.username}!`))

bot.command('start', async(ctx) => {
    ctx.reply(`Hey ${ctx.from.username}, I am Steven. Nice to meet you.`)
})

bot.on('location', ({from, message, reply}) => {
    console.log(from.id, message.location)
    reply(`Hey ${from.username}, your current location is lat/long: ${message.latitude}/${message.longitude}. Sadly, you can't update the area by now. Cheers, Steven.`)
})

bot.command('register', async(ctx) => {
    await database.insertRow('registered', '(null, ?, ?)', [ctx.chat.id, ctx.from.id])
    ctx.reply('Hey, you just registered to my ISS tracking service. Kind regards, Steven. ')
})

bot.command('deregister', async(ctx) => {
    id = ctx.from.id
    await database.deleteRowsByValue('registered', id, 'userId')
    ctx.reply('Hey, it is me Steven. You just deregistered from my ISS tracking service. Too bad. ')
})

bot.hears('where', async(ctx) => {
    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    ctx.reply(`Hey pow, the ISS is currently located near lat/long: ${locationLine[0].latitude}/${locationLine[0].longitude}`)
})

bot.launch() // start

app.use(express.json())
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
    
