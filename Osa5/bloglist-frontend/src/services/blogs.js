import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: {Authorization: token}
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
    headers: {Authorization: token}
  }
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const config = {
    headers: {Authorization: token}
  }
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

const remove = (id) => {
  const config = {
    headers: {Authorization: token}
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.status)
}

export default { getAll, setToken, create, update, remove }