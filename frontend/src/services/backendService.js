import axios from 'axios'

const getLocation = async () => {

  const response = await axios.get('/api/iss')
  return response

}

const setCoordinates = async (obj) => {
  const response = await axios.post('/api/iss/coordinates', obj)
  return response
}

const getCoordinates = async (obj) => {
  const response = await axios.get('/api/iss/coordinates')
  return response.data
}

export default { getLocation, getCoordinates, setCoordinates }