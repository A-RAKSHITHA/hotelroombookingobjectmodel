import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { loginAdmin, admin } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (admin) navigate('/admin-dashboard', { replace: true })

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = loginAdmin(username.trim(), password)
    if (result.success) {
      navigate('/admin-dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Admin Login</h1>
        <p className="auth-sub">Manage rooms, bookings and income.</p>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
        <p className="auth-hint">Demo: admin / admin123</p>
      </div>
    </div>
  )
}
