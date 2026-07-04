import { useState } from 'react'
import SearchForm, { DEFAULT_CRITERIA } from '../components/SearchForm'
import RoomCard from '../components/RoomCard'
import { getRooms, getBookings } from '../utils/storage'
import { searchRooms, validateBookingInput } from '../utils/availability'

export default function AvailabilitySearch() {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateBookingInput({
      checkInDate: criteria.checkInDate,
      checkInTime: criteria.checkInTime,
      checkOutDate: criteria.checkOutDate,
      checkOutTime: criteria.checkOutTime,
      guests: criteria.guests || 1,
    })
    if (!validation.valid) {
      setError(validation.error)
      setResults(null)
      return
    }
    setError('')
    const rooms = getRooms()
    const bookings = getBookings()
    setResults(searchRooms(rooms, bookings, criteria))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Availability Search</h1>
      </div>
      <p className="page-lead">
        Search by room type, floor, guest count and your exact check-in / check-out date &amp;
        time. Availability is checked live against current bookings.
      </p>

      <SearchForm criteria={criteria} onChange={setCriteria} onSubmit={handleSubmit} error={error} />

      {results !== null && (
        <>
          <h2 className="section-title">{results.length} room(s) matched</h2>
          {results.length === 0 ? (
            <p className="empty-state">No rooms match these filters. Try adjusting your search.</p>
          ) : (
            <div className="room-grid">
              {results.map((r) => (
                <RoomCard key={r.id} room={r} showAvailability />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
