import axios from 'axios'

const api_key = 'AIzaSyBxTSW87jEF7J9G7fz6RXlzDMBlOqXYTiQ'

const getLocation = async (longitude, latitude) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${api_key}`)
  return response.data
}


export default { getLocation }