import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookings } from '../utils/storage'

export default function UserPortal() {
  const { user, loginUser, logoutUser } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [myBookings, setMyBookings] = useState([])

  useEffect(() => {
    if (user) {
      const all = getBookings()
      setMyBookings(
        all
          .filter((b) => b.guestPhone === user.phone)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      )
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = loginUser(name, phone)
    if (!result.success) setError(result.error)
    else setError('')
  }

  if (!user) {
    return (
      <div className="page auth-page">
        <div className="auth-card">
          <h1>User Portal</h1>
          <p className="auth-sub">Enter your details to search and pre-book a room.</p>
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Full Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </label>
            <label className="field">
              <span>Phone Number</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block">
              Continue
            </button>
          </form>
          <p className="auth-hint">No password needed — just your name &amp; phone number.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome, {user.name}</h1>
        <div className="page-header-actions">
          <Link to="/book/user" className="btn btn-primary">
            Book a Room
          </Link>
          <button className="btn btn-outline" onClick={logoutUser}>
            Switch User
          </button>
        </div>
      </div>

      <h2 className="section-title">Your Bookings</h2>
      {myBookings.length === 0 ? (
        <p className="empty-state">You have no bookings yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.roomNumber}</td>
                  <td>{b.roomType}</td>
                  <td>
                    {b.checkInDate} {b.checkInTime}
                  </td>
                  <td>
                    {b.checkOutDate} {b.checkOutTime}
                  </td>
                  <td>{b.guests}</td>
                  <td>₹{b.totalPrice.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-pill status-${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
