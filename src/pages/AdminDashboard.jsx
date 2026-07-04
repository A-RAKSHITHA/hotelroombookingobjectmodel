import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRooms, saveRooms, getBookings, saveBookings } from '../utils/storage'

const EMPTY_FORM = { number: '', floor: 1, type: 'Standard', capacity: 3, price: 2000 }
const TYPE_DEFAULTS = {
  Standard: { capacity: 3, price: 2000 },
  Grand: { capacity: 2, price: 3000 },
  Deluxe: { capacity: 3, price: 4000 },
  Suite: { capacity: 4, price: 6000 },
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('rooms')
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [roomError, setRoomError] = useState('')

  useEffect(() => {
    setRooms(getRooms())
    setBookings(getBookings())
  }, [])

  const refresh = () => {
    setRooms(getRooms())
    setBookings(getBookings())
  }

  // ---------- Rooms CRUD ----------
  const handleTypeChange = (type) => {
    const defaults = TYPE_DEFAULTS[type]
    setForm((f) => ({ ...f, type, capacity: defaults.capacity, price: defaults.price }))
  }

  const startEdit = (room) => {
    setEditingId(room.id)
    setForm({
      number: room.number,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
    })
    setRoomError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setRoomError('')
  }

  const submitRoom = (e) => {
    e.preventDefault()
    const number = Number(form.number)
    const floor = Number(form.floor)
    const capacity = Number(form.capacity)
    const price = Number(form.price)

    if (!number || number <= 0) {
      setRoomError('Please enter a valid room number.')
      return
    }
    const duplicate = rooms.find((r) => r.number === number && r.id !== editingId)
    if (duplicate) {
      setRoomError(`Room number ${number} already exists.`)
      return
    }
    if (!capacity || capacity <= 0) {
      setRoomError('Capacity must be greater than 0.')
      return
    }
    if (!price || price <= 0) {
      setRoomError('Price must be greater than 0.')
      return
    }

    let updated
    if (editingId) {
      updated = rooms.map((r) =>
        r.id === editingId ? { ...r, number, floor, type: form.type, capacity, price } : r
      )
    } else {
      const newRoom = {
        id: `room-${number}-${Date.now()}`,
        number,
        floor,
        type: form.type,
        capacity,
        price,
      }
      updated = [...rooms, newRoom]
    }
    saveRooms(updated)
    setRooms(updated)
    cancelEdit()
  }

  const deleteRoom = (room) => {
    const hasActiveBooking = bookings.some(
      (b) => b.roomId === room.id && b.status !== 'cancelled'
    )
    if (hasActiveBooking) {
      alert(`Cannot delete Room ${room.number} — it has active bookings. Cancel them first.`)
      return
    }
    if (!confirm(`Delete Room ${room.number}? This cannot be undone.`)) return
    const updated = rooms.filter((r) => r.id !== room.id)
    saveRooms(updated)
    setRooms(updated)
  }

  // ---------- Bookings ----------
  const cancelBooking = (booking) => {
    if (!confirm(`Cancel booking ${booking.id} for Room ${booking.roomNumber}?`)) return
    const updated = bookings.map((b) =>
      b.id === booking.id ? { ...b, status: 'cancelled' } : b
    )
    saveBookings(updated)
    setBookings(updated)
  }

  const sortedRooms = [...rooms].sort((a, b) => a.number - b.number)
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <Link to="/income-analytics" className="btn btn-outline">
          View Income Analytics
        </Link>
      </div>

      <div className="tabs">
        <button className={tab === 'rooms' ? 'tab active' : 'tab'} onClick={() => setTab('rooms')}>
          Rooms
        </button>
        <button
          className={tab === 'bookings' ? 'tab active' : 'tab'}
          onClick={() => setTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {tab === 'rooms' && (
        <div className="admin-grid">
          <div className="admin-form-col">
            <h2 className="section-title">{editingId ? 'Edit Room' : 'Add Room'}</h2>
            <form onSubmit={submitRoom} className="stacked-form">
              <label className="field">
                <span>Room Number</span>
                <input
                  type="number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Floor</span>
                <select
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                >
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                </select>
              </label>
              <label className="field">
                <span>Type</span>
                <select value={form.type} onChange={(e) => handleTypeChange(e.target.value)}>
                  <option>Standard</option>
                  <option>Grand</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                </select>
              </label>
              <label className="field">
                <span>Capacity</span>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Price / Night (₹)</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
              {roomError && <div className="form-error">{roomError}</div>}
              <div className="form-btn-row">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Add Room'}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-list-col">
            <h2 className="section-title">All Rooms ({rooms.length})</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRooms.map((r) => (
                    <tr key={r.id}>
                      <td>{r.number}</td>
                      <td>{r.floor}</td>
                      <td>{r.type}</td>
                      <td>{r.capacity}</td>
                      <td>₹{r.price.toLocaleString('en-IN')}</td>
                      <td className="table-actions">
                        <button className="btn-link" onClick={() => startEdit(r)}>
                          Edit
                        </button>
                        <button className="btn-link btn-link-danger" onClick={() => deleteRoom(r)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div>
          <h2 className="section-title">All Bookings ({bookings.length})</h2>
          {sortedBookings.length === 0 ? (
            <p className="empty-state">No bookings yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Nights</th>
                    <th>Total</th>
                    <th>Booked By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        {b.guestName}
                        <div className="muted-sub">{b.guestPhone}</div>
                      </td>
                      <td>
                        {b.roomNumber} &middot; {b.roomType}
                      </td>
                      <td>
                        {b.checkInDate} {b.checkInTime}
                      </td>
                      <td>
                        {b.checkOutDate} {b.checkOutTime}
                      </td>
                      <td>{b.nights}</td>
                      <td>₹{b.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="capitalize">{b.bookedBy}</td>
                      <td>
                        <span className={`status-pill status-${b.status}`}>{b.status}</span>
                      </td>
                      <td>
                        {b.status !== 'cancelled' && (
                          <button
                            className="btn-link btn-link-danger"
                            onClick={() => cancelBooking(b)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
