import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StaffLogin() {
  const { loginStaff, staff } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (staff) navigate('/book/staff', { replace: true })

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = loginStaff(username.trim(), password)
    if (result.success) {
      navigate('/book/staff')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Staff Login</h1>
        <p className="auth-sub">Book rooms for walk-in guests.</p>
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
        <p className="auth-hint">Demo: staff / staff123</p>
      </div>
    </div>
  )
}
