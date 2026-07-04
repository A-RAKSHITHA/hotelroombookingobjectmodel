const ROOM_TYPES = ['All', 'Standard', 'Grand', 'Deluxe', 'Suite']
const FLOORS = ['All', '1', '2', '3']

export default function SearchForm({ criteria, onChange, onSubmit, error }) {
  const set = (field) => (e) => onChange({ ...criteria, [field]: e.target.value })

  return (
    <form className="search-form" onSubmit={onSubmit}>
      <div className="search-grid">
        <label className="field">
          <span>Room Type</span>
          <select value={criteria.type} onChange={set('type')}>
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Floor</span>
          <select value={criteria.floor} onChange={set('floor')}>
            {FLOORS.map((f) => (
              <option key={f} value={f}>
                {f === 'All' ? 'All Floors' : `Floor ${f}`}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Guests</span>
          <input
            type="number"
            min="1"
            max="10"
            value={criteria.guests}
            onChange={set('guests')}
            placeholder="e.g. 2"
          />
        </label>

        <label className="field">
          <span>Check-in Date</span>
          <input type="date" value={criteria.checkInDate} onChange={set('checkInDate')} />
        </label>

        <label className="field">
          <span>Check-in Time</span>
          <input type="time" value={criteria.checkInTime} onChange={set('checkInTime')} />
        </label>

        <label className="field">
          <span>Check-out Date</span>
          <input type="date" value={criteria.checkOutDate} onChange={set('checkOutDate')} />
        </label>

        <label className="field">
          <span>Check-out Time</span>
          <input type="time" value={criteria.checkOutTime} onChange={set('checkOutTime')} />
        </label>

        <div className="field search-btn-field">
          <button type="submit" className="btn btn-primary btn-block">
            Search Rooms
          </button>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
    </form>
  )
}

export const DEFAULT_CRITERIA = {
  type: 'All',
  floor: 'All',
  guests: '',
  checkInDate: '',
  checkInTime: '12:00',
  checkOutDate: '',
  checkOutTime: '11:00',
}
