import { useState } from 'react'
import SearchForm, { DEFAULT_CRITERIA } from './SearchForm'
import RoomCard from './RoomCard'
import { getRooms, getBookings, saveBookings } from '../utils/storage'
import { searchRooms, validateBookingInput, calcNights, calcTotal } from '../utils/availability'

// bookedBy: 'staff' | 'user' — just tags the booking record for analytics.
// fixedGuest: { name, phone } when the identity should not be editable (User Booking Page).
export default function BookingFlow({ bookedBy, fixedGuest }) {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [results, setResults] = useState(null)
  const [searchError, setSearchError] = useState('')

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [guestName, setGuestName] = useState(fixedGuest?.name || '')
  const [guestPhone, setGuestPhone] = useState(fixedGuest?.phone || '')
  const [bookingError, setBookingError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const runSearch = (e) => {
    e.preventDefault()
    const validation = validateBookingInput({
      checkInDate: criteria.checkInDate,
      checkInTime: criteria.checkInTime,
      checkOutDate: criteria.checkOutDate,
      checkOutTime: criteria.checkOutTime,
      guests: criteria.guests || 1,
    })
    if (!validation.valid) {
      setSearchError(validation.error)
      setResults(null)
      return
    }
    setSearchError('')
    setSelectedRoom(null)
    setConfirmation(null)
    const rooms = getRooms()
    const bookings = getBookings()
    setResults(searchRooms(rooms, bookings, criteria))
  }

  const nights = calcNights(
    criteria.checkInDate,
    criteria.checkInTime,
    criteria.checkOutDate,
    criteria.checkOutTime
  )
  const total = selectedRoom ? calcTotal(selectedRoom.price, nights) : 0

  const selectRoom = (room) => {
    setBookingError('')
    setConfirmation(null)
    setSelectedRoom(room)
  }

  const confirmBooking = (e) => {
    e.preventDefault()
    if (!selectedRoom) return

    const validation = validateBookingInput({
      checkInDate: criteria.checkInDate,
      checkInTime: criteria.checkInTime,
      checkOutDate: criteria.checkOutDate,
      checkOutTime: criteria.checkOutTime,
      guests: criteria.guests,
      room: selectedRoom,
    })
    if (!validation.valid) {
      setBookingError(validation.error)
      return
    }
    if (!guestName.trim() || !guestPhone.trim()) {
      setBookingError('Guest name and phone number are required.')
      return
    }

    // Re-check availability right before booking to guard against
    // a race where another booking was made after the search ran.
    const rooms = getRooms()
    const bookings = getBookings()
    const fresh = searchRooms(rooms, bookings, criteria).find((r) => r.id === selectedRoom.id)
    if (!fresh || fresh.available === false) {
      setBookingError('This room was just booked by someone else. Please search again.')
      setResults(searchRooms(rooms, bookings, criteria))
      setSelectedRoom(null)
      return
    }

    const newBooking = {
      id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.number,
      roomType: selectedRoom.type,
      floor: selectedRoom.floor,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guests: Number(criteria.guests),
      checkInDate: criteria.checkInDate,
      checkInTime: criteria.checkInTime,
      checkOutDate: criteria.checkOutDate,
      checkOutTime: criteria.checkOutTime,
      nights,
      pricePerNight: selectedRoom.price,
      totalPrice: total,
      bookedBy,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    saveBookings([...bookings, newBooking])
    setConfirmation(newBooking)
    setSelectedRoom(null)
    setResults(searchRooms(getRooms(), getBookings(), criteria))
  }

  return (
    <div>
      <SearchForm
        criteria={criteria}
        onChange={setCriteria}
        onSubmit={runSearch}
        error={searchError}
      />

      {results !== null && !confirmation && (
        <>
          <h2 className="section-title">{results.length} room(s) matched</h2>
          {results.length === 0 ? (
            <p className="empty-state">No rooms match these filters.</p>
          ) : (
            <div className="room-grid">
              {results.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  showAvailability
                  footer={
                    r.available && (
                      <button
                        className={`btn btn-block ${
                          selectedRoom?.id === r.id ? 'btn-primary' : 'btn-outline'
                        }`}
                        onClick={() => selectRoom(r)}
                      >
                        {selectedRoom?.id === r.id ? 'Selected' : 'Select Room'}
                      </button>
                    )
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedRoom && !confirmation && (
        <div className="booking-panel">
          <h2 className="section-title">Confirm Booking — Room {selectedRoom.number}</h2>
          <form onSubmit={confirmBooking} className="booking-form">
            <div className="search-grid">
              <label className="field">
                <span>Guest Name</span>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={!!fixedGuest}
                />
              </label>
              <label className="field">
                <span>Guest Phone</span>
                <input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  disabled={!!fixedGuest}
                />
              </label>
            </div>

            <div className="summary-box">
              <div className="summary-row">
                <span>Room</span>
                <span>
                  {selectedRoom.number} &middot; {selectedRoom.type}
                </span>
              </div>
              <div className="summary-row">
                <span>Guests</span>
                <span>
                  {criteria.guests} / {selectedRoom.capacity} capacity
                </span>
              </div>
              <div className="summary-row">
                <span>Check-in</span>
                <span>
                  {criteria.checkInDate} {criteria.checkInTime}
                </span>
              </div>
              <div className="summary-row">
                <span>Check-out</span>
                <span>
                  {criteria.checkOutDate} {criteria.checkOutTime}
                </span>
              </div>
              <div className="summary-row">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total Price</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {bookingError && <div className="form-error">{bookingError}</div>}
            <button type="submit" className="btn btn-primary btn-block">
              Confirm Booking
            </button>
          </form>
        </div>
      )}

      {confirmation && (
        <div className="confirmation-box">
          <h2>Booking Confirmed ✓</h2>
          <p className="confirmation-id">Booking ID: {confirmation.id}</p>
          <div className="summary-box">
            <div className="summary-row">
              <span>Guest</span>
              <span>
                {confirmation.guestName} &middot; {confirmation.guestPhone}
              </span>
            </div>
            <div className="summary-row">
              <span>Room</span>
              <span>
                {confirmation.roomNumber} &middot; {confirmation.roomType} &middot; Floor{' '}
                {confirmation.floor}
              </span>
            </div>
            <div className="summary-row">
              <span>Check-in</span>
              <span>
                {confirmation.checkInDate} {confirmation.checkInTime}
              </span>
            </div>
            <div className="summary-row">
              <span>Check-out</span>
              <span>
                {confirmation.checkOutDate} {confirmation.checkOutTime}
              </span>
            </div>
            <div className="summary-row">
              <span>Nights</span>
              <span>{confirmation.nights}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total Paid</span>
              <span>₹{confirmation.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => {
              setConfirmation(null)
              setResults(null)
              setCriteria(DEFAULT_CRITERIA)
            }}
          >
            Make Another Booking
          </button>
        </div>
      )}
    </div>
  )
}
