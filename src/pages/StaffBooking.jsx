import BookingFlow from '../components/BookingFlow'
import { useAuth } from '../context/AuthContext'

export default function StaffBooking() {
  const { staff } = useAuth()
  return (
    <div className="page">
      <div className="page-header">
        <h1>Staff Booking</h1>
      </div>
      <p className="page-lead">
        Logged in as <strong>{staff?.username}</strong>. Search availability and book a room for a
        walk-in customer.
      </p>
      <BookingFlow bookedBy="staff" />
    </div>
  )
}
