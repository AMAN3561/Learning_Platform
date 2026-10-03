import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('lp_user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [token, setToken] = useState(() => localStorage.getItem('lp_token'))

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password })
    localStorage.setItem('lp_token', response.token)
    localStorage.setItem('lp_user', JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
    return response
  }

  const refreshUser = async () => {
    if (!localStorage.getItem('lp_token')) return null
    const response = await api.profile.get()
    localStorage.setItem('lp_user', JSON.stringify(response.data))
    setUser(response.data)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('lp_token')
    localStorage.removeItem('lp_user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, logout, refreshUser, setUser }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
