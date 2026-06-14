import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = localStorage.getItem('username')
    const access = localStorage.getItem('access')
    if (username && access) setUser({ username })
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/users/login/', { username, password })
    localStorage.setItem('access', res.data.access)
    localStorage.setItem('refresh', res.data.refresh)
    localStorage.setItem('username', username)
    setUser({ username })
    return res.data
  }

  const register = async (username, password, email) => {
    const res = await api.post('/users/register/', { username, password, email })
    localStorage.setItem('access', res.data.access)
    localStorage.setItem('refresh', res.data.refresh)
    localStorage.setItem('username', username)
    setUser({ username })
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/users/logout/', { refresh: localStorage.getItem('refresh') })
    } catch {}
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)