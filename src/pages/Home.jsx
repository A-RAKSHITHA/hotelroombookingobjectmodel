import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Grand Villa Hotel</p>
          <h1>Simple, elegant room booking.</h1>
          <p className="hero-sub">
            Twelve rooms across three floors — Standard, Grand, Deluxe and Suite. Check real-time
            availability and book in seconds.
          </p>
          <div className="hero-actions">
            <Link to="/availability" className="btn btn-primary">
              Check Availability
            </Link>
            <Link to="/user-portal" className="btn btn-outline">
              Book a Stay
            </Link>
          </div>
        </div>
      </section>

      <section className="home-grid">
        <Link to="/availability" className="home-card">
          <h3>Availability Search</h3>
          <p>Filter rooms by type, floor, guests and dates before you commit.</p>
        </Link>
        <Link to="/user-portal" className="home-card">
          <h3>User Portal</h3>
          <p>Enter your details, pre-book a room and get instant confirmation.</p>
        </Link>
        <Link to="/staff-login" className="home-card">
          <h3>Staff Login</h3>
          <p>Front-desk access to book rooms for walk-in guests.</p>
        </Link>
        <Link to="/admin-login" className="home-card">
          <h3>Admin Login</h3>
          <p>Manage rooms, bookings and view income analytics.</p>
        </Link>
      </section>

      <section className="room-types-strip">
        <h2>Room Types</h2>
        <div className="type-grid">
          <div className="type-card">
            <h4>Standard</h4>
            <p>Up to 3 guests</p>
            <p className="type-price">₹2,000 / night</p>
          </div>
          <div className="type-card">
            <h4>Grand</h4>
            <p>Up to 2 guests</p>
            <p className="type-price">₹3,000 / night</p>
          </div>
          <div className="type-card">
            <h4>Deluxe</h4>
            <p>Up to 3 guests</p>
            <p className="type-price">₹4,000 / night</p>
          </div>
          <div className="type-card">
            <h4>Suite</h4>
            <p>Up to 4 guests</p>
            <p className="type-price">₹6,000 / night</p>
          </div>
        </div>
      </section>
    </div>
  )
}
