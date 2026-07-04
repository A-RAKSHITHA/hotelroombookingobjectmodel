import BookingFlow from '../components/BookingFlow'
import { useAuth } from '../context/AuthContext'

export default function UserBooking() {
  const { user } = useAuth()
  return (
    <div className="page">
      <div className="page-header">
        <h1>Book a Room</h1>
      </div>
      <p className="page-lead">
        Booking as <strong>{user?.name}</strong>. Search available rooms and pre-book your stay.
      </p>
      <BookingFlow bookedBy="user" fixedGuest={{ name: user?.name, phone: user?.phone }} />
    </div>
  )
}
