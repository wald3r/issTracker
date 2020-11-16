const sqlite3 = require('sqlite3').verbose();

const locationData = `
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude FLOAT,
    longitude FLOAT 
`

const registeredData = `
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId INTEGER,
    userId INTEGER 
`

const coordinatesData = `
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    aLat FLOAT,
    aLong FLOAT,
    bLat FLOAT,
    bLong FLOAT

`


const checkDatabase = async () => {
    db = await openDatabase()
    db.exec('PRAGMA foreign_keys = ON', (err)=> {
      if(err){
        console.log(`PragmaHelper: ${err}`)
      }else{
        console.log('PragmaHelper: Activated foreign keys')
      }
    })
    createTable(db, 'location', locationData)
    createTable(db, 'registered', registeredData)
    createTable(db, 'coordinates', coordinatesData)
    
    await closeDatabase(db)
}

const createTable = (db, name, values) => {
    db.run(`CREATE TABLE if not exists ${name} (${values})`)
}
  
const openDatabase = async () => {
    let db = null
  
    await new Promise((resolve) => {
      db = new sqlite3.Database('sqlite.db', async(err) => {
        if (err) {
          return console.error(err.message);
        }
        resolve()
  
      })
      
    })
    return db
}

const insertRow = async(tableName, tableValues, params) => {
    let db = await openDatabase()
    let id = await new Promise((resolve) => {
      db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO ${tableName} VALUES ${tableValues}`)
        stmt.run(params, function(err){
          if(err){
            console.log(err)
            stmt.finalize()
            resolve(-1)
          }else{ 
            stmt.finalize()
            resolve(this.lastID)
          }
        })
      })
    })
    await closeDatabase(db)
    return id
}

const updateById = async(tableName, tableValues, params) => {
    let db = await openDatabase()
    let code = await new Promise((resolve) => {
      db.run(`UPDATE ${tableName} 
            SET ${tableValues}
            WHERE rowid=?`, params,(err) => {
        if (err) {
          console.error(`${tableName}: ${err.message}`)
          resolve(500)
        }else{
          console.log(`${tableName}: Row ${params[params.length-1]} updated with ${params}`)
          resolve(200)
        }
      })
    })
    await closeDatabase(db)
    return code
}

const deleteRowById = async (tableName, id) => {

    let db = await openDatabase()
  
    let code = await new Promise((resolve) => {
      db.run(`DELETE FROM ${tableName} WHERE rowid=?`, id, (err) => {
        if (err) {
          console.error(`${tableName}: ${err.message}`)
          resolve(-1)
        }else{
          console.log(`${tableName}: Row deleted ${id}`)
          resolve(1)
        }
      })
    })
    await closeDatabase(db)
    return code
}

const selectAllRows = async(tableValues, tableName) => {

    let db = await openDatabase()
    let responseArray = []
  
    responseArray = await new Promise((resolve) => {
      db.serialize(async () => {
        db.all(`SELECT ${tableValues} FROM ${tableName}`, (err, rows) => {
          if(rows === undefined){
            resolve(responseArray)
          }else{
            rows.map(row =>{
              responseArray = responseArray.concat(row)
            })
            resolve(responseArray)
          }
        })
      })
    })
    await closeDatabase(db)
    return responseArray
}

const deleteRowsByValue = async (tableName, param, value) => {

  let db = await openDatabase()
  let code = await new Promise((resolve) => {
    db.run(`DELETE FROM ${tableName} WHERE ${value}=?`, param, (err) => {
      if (err) {
        console.error(`${tableName}: ${err.message}`)
        resolve(-1)
      }else{
        console.log(`${tableName}: Rows with ${value} ${param} deleted`)
        resolve(1)
      }
    })
  })
  await closeDatabase(db)
  return code
}
  

const closeDatabase = async (db) => {
  return await new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      resolve()
    })
  })
}


module.exports = { checkDatabase, insertRow, selectAllRows, deleteRowById, updateById, deleteRowsByValue }