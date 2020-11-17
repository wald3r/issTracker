
const Telegraf = require('telegraf')
require('dotenv').config()
const database = require('./utils/database')

const bot = new Telegraf(process.env.TOKEN) 


bot.hears('hi', (ctx) => ctx.reply('Hey there')) 
bot.hears('hello', ctx => ctx.reply(`Hey ${ctx.from.username}!`))

bot.command('start', async(ctx) => {
    ctx.reply(`Hey ${ctx.from.username}, I am Steven. Nice to meet you.`)
})

bot.on('location', async ({from, message, reply}) => {
    console.log(from.id, message.location)
    const lat = message.location.latitude
    const long = message.location.longitude

    const coordinates = await database.selectAllRows('aLat,aLong, bLat, bLong', 'coordinates')
    if(coordinates.length !== 0){
        await database.updateById('coordinates', 'aLat = ?, aLong = ?, bLat = ?, bLong = ?', [lat + 0.1, long - 0.1, lat - 0.1, long + 0.1, 1])
    }else{
        await database.insertRow('coordinates', '(null, ?, ?, ?, ?)', [lat + 0.1, long - 0.1, lat - 0.1, long + 0.1])
    }
    reply(`Hey ${from.username}, your new scanning area is lat/long: ${message.location.latitude}/${message.location.longitude}. Cheers, Steven.`)
})

bot.hears('area', async (ctx) => {
    const id = ctx.from.id
    const coordinates = await database.selectAllRows('aLat, aLong, bLat, bLong', 'coordinates')
    if(coordinates.length === 0){
        ctx.reply('Hey mate, there is currently no area set to scan. Do you want to set some? Just send your location to me.')
    }else{
        const lat = coordinates[0].aLat - 0.1
        const long = coordinates[0].aLong + 0.1
        bot.telegram.sendLocation(id, lat, long)
    }
})

bot.command('register', async(ctx) => {
    const registrationRows = await database.selectAllRows('rowid, chatId, userId', 'registered')
    const line = registrationRows.filter(user => user.userId === ctx.from.id)
    if(line.length === 0){
        await database.insertRow('registered', '(null, ?, ?)', [ctx.chat.id, ctx.from.id])
        ctx.reply('Hey, you just registered to my ISS tracking service. Kind regards, Steven. ')
    }else{
        ctx.reply('Hey mate, it appears you have already registered to my awesome service. Keep enjoying it, Steven.')
    } 
})

bot.command('deregister', async(ctx) => {
    id = ctx.from.id
    const registrationRows = await database.selectAllRows('rowid, chatId, userId', 'registered')
    const line = registrationRows.filter(user => user.userId === id)
    if(line.length !== 0){
        await database.deleteRowsByValue('registered', id, 'userId')
        ctx.reply('Hey, it is me Steven. You just deregistered from my ISS tracking service. Too bad. ')
    }else{
        ctx.reply('Hey, it is me Steven. You are not even registered. Stop trying to deregister.')
    }
    
})

bot.hears('where', async(ctx) => {
    const locationLine = await database.selectAllRows('rowid, latitude, longitude', 'location')
    if(locationLine.length !== 0){
        ctx.reply(`Hey pow, the ISS is currently located near lat/long: ${locationLine[0].latitude}/${locationLine[0].longitude}`)
    }else{
        ctx.reply(`Hey pow, I have no idea where the ISS is. Maybe it disappeared into a black hole.`)
    }
})

bot.launch() // start

module.exports = bot