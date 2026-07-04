import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { admin, staff, user, logoutAdmin, logoutStaff, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link')

  const handleLogout = () => {
    if (admin) logoutAdmin()
    if (staff) logoutStaff()
    if (user) logoutUser()
    close()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">GV</span>
          <span className="brand-name">Grand Villa Hotel</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={close}>
            Home
          </Link>
          <Link to="/availability" className={isActive('/availability')} onClick={close}>
            Availability
          </Link>

          {!user && (
            <Link to="/user-portal" className={isActive('/user-portal')} onClick={close}>
              User Portal
            </Link>
          )}
          {user && (
            <Link to="/book/user" className={isActive('/book/user')} onClick={close}>
              Book a Room
            </Link>
          )}

          {!staff && (
            <Link to="/staff-login" className={isActive('/staff-login')} onClick={close}>
              Staff Login
            </Link>
          )}
          {staff && (
            <Link to="/book/staff" className={isActive('/book/staff')} onClick={close}>
              Staff Booking
            </Link>
          )}

          {!admin && (
            <Link to="/admin-login" className={isActive('/admin-login')} onClick={close}>
              Admin Login
            </Link>
          )}
          {admin && (
            <>
              <Link to="/admin-dashboard" className={isActive('/admin-dashboard')} onClick={close}>
                Dashboard
              </Link>
              <Link to="/income-analytics" className={isActive('/income-analytics')} onClick={close}>
                Analytics
              </Link>
            </>
          )}

          {(admin || staff || user) && (
            <button className="nav-link nav-logout" onClick={handleLogout}>
              Logout {admin ? '(Admin)' : staff ? '(Staff)' : user ? `(${user.name})` : ''}
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
