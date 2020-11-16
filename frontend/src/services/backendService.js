import axios from 'axios'

const sendLocation = async (obj) => {

  const response = await axios.post('/api/iss', obj)
  return response

}

const importNotification = async () => {
  const response = await axios.get('/api/iss/notification')
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

export default { sendLocation, importNotification, getCoordinates, setCoordinates }