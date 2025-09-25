import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, 
})

export function setToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function clearToken() {
  delete api.defaults.headers.common['Authorization']
}

api.setToken = setToken
api.clearToken = clearToken

export default api
