import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminRoute({ children }) {
  const { admin } = useAuth()
  if (!admin) return <Navigate to="/admin-login" replace />
  return children
}

export function StaffRoute({ children }) {
  const { staff } = useAuth()
  if (!staff) return <Navigate to="/staff-login" replace />
  return children
}

export function UserRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/user-portal" replace />
  return children
}
