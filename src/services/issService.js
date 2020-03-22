import axios from 'axios'


const getLocation = async () => {
  const response = await axios.get(`http://api.open-notify.org/iss-now.json`)
  return response.data
}

export default { getLocation }