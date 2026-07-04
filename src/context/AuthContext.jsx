import { createContext, useContext, useState, useCallback } from 'react'
import { KEYS, getSession, setSession } from '../utils/storage'

// Hardcoded demo credentials — this is a frontend-only project with no backend.
export const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' }
export const STAFF_CREDENTIALS = { username: 'staff', password: 'staff123' }

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => getSession(KEYS.ADMIN_SESSION))
  const [staff, setStaff] = useState(() => getSession(KEYS.STAFF_SESSION))
  const [user, setUser] = useState(() => getSession(KEYS.USER_SESSION))

  const loginAdmin = useCallback((username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const session = { username, loginAt: new Date().toISOString() }
      setSession(KEYS.ADMIN_SESSION, session)
      setAdmin(session)
      return { success: true }
    }
    return { success: false, error: 'Invalid admin username or password.' }
  }, [])

  const loginStaff = useCallback((username, password) => {
    if (username === STAFF_CREDENTIALS.username && password === STAFF_CREDENTIALS.password) {
      const session = { username, loginAt: new Date().toISOString() }
      setSession(KEYS.STAFF_SESSION, session)
      setStaff(session)
      return { success: true }
    }
    return { success: false, error: 'Invalid staff username or password.' }
  }, [])

  const loginUser = useCallback((name, phone) => {
    if (!name.trim() || !phone.trim()) {
      return { success: false, error: 'Please enter your name and phone number.' }
    }
    const session = { name: name.trim(), phone: phone.trim(), loginAt: new Date().toISOString() }
    setSession(KEYS.USER_SESSION, session)
    setUser(session)
    return { success: true }
  }, [])

  const logoutAdmin = useCallback(() => {
    setSession(KEYS.ADMIN_SESSION, null)
    setAdmin(null)
  }, [])

  const logoutStaff = useCallback(() => {
    setSession(KEYS.STAFF_SESSION, null)
    setStaff(null)
  }, [])

  const logoutUser = useCallback(() => {
    setSession(KEYS.USER_SESSION, null)
    setUser(null)
  }, [])

  const value = {
    admin,
    staff,
    user,
    loginAdmin,
    loginStaff,
    loginUser,
    logoutAdmin,
    logoutStaff,
    logoutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
