import React, { useState, useEffect } from 'react';
import issService from './services/issService'
import geolocationService from './services/geolocationService'
import { postCoordinateB, postCoordinateA, getCoordinate } from './backend/pouchDB'

const App = () => {

  const [issData, setIssData] = useState(null)
  const [geoData, setGeoData] = useState(null)
  const [coordinateA, setCoordinateA] = useState({})
  const [coordinateB, setCoordinateB] = useState({})

  useEffect(() => {
    updateISSData()
    getCoordinates()
  }, []);


  const style = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  }

  const getCoordinates = async () => {
    const responseA = await getCoordinate('coordinateA')
    setCoordinateA({latitude: responseA.latitude, longitude: responseA.longitude})
    const responseB = await getCoordinate('coordinateB')
    setCoordinateB({latitude: responseB.latitude, longitude: responseB.longitude})
  }

  const isAround = () => {
    let lat = issData.iss_position.latitude
    let long = issData.iss_position.longitude


    if(Number(lat) < coordinateB.latitude) return 'false' 
    else if (Number(lat) > Number(coordinateA.latitude)) return 'false'
    else if (Number(long) < Number(coordinateA.longitude)) return 'false'
    else if (Number(long) > Number(coordinateB.longitude)) return 'false'
    else {
      console.log('sending...')
      sendNotification()
      return 'true'
    }
  }

  const sendNotification = async () => {
    const templateId = 'template_vK0F4z4Q'
    const serviceId = 'securebox20_gmail_com'
    const params = {
      from_name: 'issTracker',
      to_name: 'Daniel'
    }
    try{
      await window.emailjs.send(serviceId, templateId, params)
    }catch(err){
      console.log(err)
    }
  }

  const handleCoordinates = async (e) => {
    e.preventDefault()
    await postCoordinateA(coordinateA.latitude, coordinateA.longitude)
    await postCoordinateB(coordinateB.latitude, coordinateB.longitude)

  }

  const getISSData = async () => {
      setInterval(async () => {setIssData(await issService.getLocation())}, 1000*60*5);
      console.log('get iss data')
      //setIssData(await issService.getLocation())
    
  }

  const updateISSData = async () => {
    console.log('get iss data')
    setIssData(await issService.getLocation())
    getISSData()
  }

  const getGeoData = async () => {
    console.log('get location data')
    setGeoData(await geolocationService.getLocation(issData.iss_position.longitude, issData.iss_position.latitude))
    getISSData()
  }

  const handleGeoLocation = () => {
    if(geoData === null){
      return 'Geographical Location: needs to be determined'
    }else if (geoData.status !== 'OK'){
      return 'Geographical Location: unknown'
    }else{
      return `Geographical Location: ${geoData.results[0].formatted_address}`
    }
  }

  if(issData === null){
    return(
      <div>
        <h1>ISS Location Tracker</h1>
        Loading data...
      </div>
    )
  } else {
    return (

      <div style={{ textAlign: 'center' }}>
        <h1>ISS Location Tracker</h1>
        <div style={style}>
          <div>
            <h2>Current Location:</h2>
            <button onClick={() => updateISSData()}>Update Location</button><br />
            Latitude: {issData.iss_position.latitude}<br />
            Longitude: {issData.iss_position.longitude}<br />
          </div>
          <div>        
            <h2>GeoLocation:</h2>
            <button onClick={() => getGeoData()}>Determine GeoLocation</button><br />
            {handleGeoLocation()}<br/>
          </div>
          <div>
            <h2>Scan Area:</h2>
            Area Coordinates: <br/>
            Coordinate A: {coordinateA.latitude}, {coordinateA.longitude}<br/>
            Coordinate B: {coordinateB.latitude}, {coordinateB.longitude}<br/>
            <br/>
            Is the ISS in the area? {isAround()}<br/>
          </div>
          <div>
            <h2>Set Area to Scan</h2>
              <form onSubmit={handleCoordinates}>
                <div>Coordinate A Latitude <input defaultValue={coordinateA.latitude} onChange={({target}) => setCoordinateA({latitude: target.value, longitude: coordinateA.longitude})}/></div>
                <div>Coordinate A Longitude <input defaultValue={coordinateA.longitude} onChange={({target}) => setCoordinateA({latitude: coordinateA.latitude, longitude: target.value})}/></div>
                <div>Coordinate B Latitude <input defaultValue={coordinateB.latitude} onChange={({target}) => setCoordinateB({latitude: target.value, longitude: coordinateB.longitude})}/></div>
                <div>Coordinate B Longitude <input defaultValue={coordinateB.longitude} onChange={({target}) => setCoordinateB({latitude: coordinateB.latitude, longitude: target.value})}/></div>
                <button type='Submit'>Save</button>
              </form>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
