export default function RoomCard({ room, showAvailability = false, footer }) {
  const badge =
    room.available === null || room.available === undefined
      ? null
      : room.available
      ? { text: 'Available', cls: 'badge-available' }
      : { text: 'Booked / Not Available', cls: 'badge-booked' }

  return (
    <div className={`room-card ${room.available === false ? 'room-card-booked' : ''}`}>
      <div className="room-card-top">
        <div className="room-number">Room {room.number}</div>
        {showAvailability && badge && <span className={`badge ${badge.cls}`}>{badge.text}</span>}
      </div>
      <div className="room-type">{room.type}</div>
      <div className="room-meta">
        <span>Floor {room.floor}</span>
        <span>&middot;</span>
        <span>Up to {room.capacity} guests</span>
      </div>
      <div className="room-price">
        ₹{room.price.toLocaleString('en-IN')} <span className="room-price-unit">/ night</span>
      </div>
      {showAvailability && room.available === false && room.conflict && (
        <div className="room-conflict">
          Booked {room.conflict.checkInDate} {room.conflict.checkInTime} &rarr;{' '}
          {room.conflict.checkOutDate} {room.conflict.checkOutTime}
        </div>
      )}
      {footer && <div className="room-card-footer">{footer}</div>}
    </div>
  )
}
