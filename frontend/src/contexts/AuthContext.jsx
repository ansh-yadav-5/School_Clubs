import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'

const AuthContext = createContext()
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.setToken(token)
    
      api.get('/users/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          api.clearToken()
          localStorage.removeItem('token')
        })
    }
  }, [])

  async function signup(name, email, password, role = 'student') {
    const res = await api.post('/api/auth/register', { name, email, password, role })
    localStorage.setItem('token', res.data.token)
    api.setToken(res.data.token)
    setUser(res.data.user)
  }

  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    api.setToken(res.data.token)
    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    api.clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
