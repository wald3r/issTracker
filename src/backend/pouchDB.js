import PouchDB from 'pouchdb';


export const db = new PouchDB('issdatabase')

export const destroyDb = async () => {
  try{
    await db.destroy()
  } catch (err) {
    console.log(err)
  }
}

const deleteCoordinate = async (id) => {
  try{
    const object = await db.get(id)
    await db.remove(object)

  } catch (err) {
    console.log(err)
  }
}

export const postCoordinateA = async (latitude, longitude) => {
  try {
    await deleteCoordinate('coordinateA')
    const response = await db.put({
      _id: 'coordinateA',
      latitude: latitude,
      longitude: longitude
    });
    console.log(response)
    return response

  } catch (err) {
    console.log(err);
  }
}

export const postCoordinateB = async (latitude, longitude) => {
  try {
    await deleteCoordinate('coordinateB')
    const response = await db.put({
      _id: 'coordinateB',
      latitude: latitude,
      longitude: longitude
    });
    console.log(response)
    return response

  } catch (err) {
    console.log(err);
  }
}


export const getCoordinate = async id => {
  try{
    const response = await db.get(id)
    return response
  } catch(err){
    await db.put({
      _id: 'coordinateA',
      latitude: 60,
      longitude: 30
    });
    await db.put({
      _id: 'coordinateB',
      latitude: 60,
      longitude: 30
    });

    const response = await db.get('coordinateA')
    return response
  }

}



