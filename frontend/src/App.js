import React, { useState, useEffect } from 'react';
import issService from './services/issService'
import geolocationService from './services/geolocationService'
import backendService from './services/backendService'

const App = () => {

  const [issData, setIssData] = useState(null)
  const [geoData, setGeoData] = useState(null)
  const [coordinateA, setCoordinateA] = useState({latitude: 50, longitude: 50})
  const [coordinateB, setCoordinateB] = useState({latitude: 50, longitude: 50})
  
  
  useEffect(() => {
    handleISSData()
    getCoordinates()
  }, []);


  const style = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  }


  const getCoordinates = async () => {
    const data = await backendService.getCoordinates()

    setCoordinateA({latitude: data.aLat, longitude: data.aLong})
    setCoordinateB({latitude: data.bLat, longitude: data.bLong})
  }

  const isAround = () => {
    let lat = issData.iss_position.latitude
    let long = issData.iss_position.longitude

    if(Number(lat) < coordinateB.latitude) return 'No' 
    else if (Number(lat) > Number(coordinateA.latitude)) return 'No'
    else if (Number(long) < Number(coordinateA.longitude)) return 'No'
    else if (Number(long) > Number(coordinateB.longitude)) return 'No'
    else {
      console.log('sending...')        
      sendNotification()
      backendService.importNotification()
      return 'Yes'
    }
  }

  const sendNotification = async () => {
    const templateId = 'template_vK0F4z4Q'
    const serviceId = 'iss_tracker'
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


  const getISSData = async () => {
      setInterval(() => { window.location.reload() }, 1000*60)
      
  }


  const handleISSData = async () => {
 
    console.log('get iss data')
    const tmp = await issService.getLocation()
    await backendService.sendLocation({latitude: tmp.iss_position.latitude, longitude: tmp.iss_position.longitude})
    setIssData(tmp)
    getISSData()
    

  }


  const getGeoData = async () => {
    console.log('get location data')
    setGeoData(await geolocationService.getLocation(issData.iss_position.longitude, issData.iss_position.latitude))
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

  const handleCoordinates = async (e) => {
    e.preventDefault()
    await backendService.setCoordinates({ coordinateA: { latitude: coordinateA.latitude, longitude: coordinateA.longitude }, coordinateB: { latitude: coordinateB.latitude, longitude: coordinateB.longitude }})
    
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
    
            <button onClick={() => handleISSData()}>Update Location</button><br />
            Latitude: {issData.iss_position.latitude}<br />
            Longitude: {issData.iss_position.longitude}<br />
          </div>
          <div>        
            <h2>GeoLocation:</h2>
            <div><button onClick={() => getGeoData()}>Determine GeoLocation</button></div><br />
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
