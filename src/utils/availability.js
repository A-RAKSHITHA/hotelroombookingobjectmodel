// All booking-correctness rules live in this one file so every page
// (Availability Search, Staff Booking, User Booking, Admin Dashboard)
// shares the exact same logic and never disagrees on availability.

export function toDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  const dt = new Date(`${dateStr}T${timeStr}`)
  return isNaN(dt.getTime()) ? null : dt
}

// Whole nights between check-in and check-out, always at least 1
// (minimum charge = 1 night), rounded UP for any partial day.
export function calcNights(checkInDate, checkInTime, checkOutDate, checkOutTime) {
  const inDT = toDateTime(checkInDate, checkInTime)
  const outDT = toDateTime(checkOutDate, checkOutTime)
  if (!inDT || !outDT) return 0
  const diffMs = outDT.getTime() - inDT.getTime()
  if (diffMs <= 0) return 0
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

export function calcTotal(pricePerNight, nights) {
  return pricePerNight * nights
}

// Standard interval-overlap test: two bookings clash if one starts
// before the other ends, in both directions.
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

// Validates the raw search/booking form values before we even
// touch availability. Returns { valid, error }.
export function validateBookingInput({
  checkInDate,
  checkInTime,
  checkOutDate,
  checkOutTime,
  guests,
  room,
}) {
  const inDT = toDateTime(checkInDate, checkInTime)
  const outDT = toDateTime(checkOutDate, checkOutTime)

  if (!inDT || !outDT) {
    return { valid: false, error: 'Please provide valid check-in and check-out date/time.' }
  }
  if (outDT.getTime() <= inDT.getTime()) {
    return { valid: false, error: 'Check-out date/time must be after check-in date/time.' }
  }
  if (!guests || Number(guests) <= 0) {
    return { valid: false, error: 'Please enter the number of guests.' }
  }
  if (room && Number(guests) > room.capacity) {
    return {
      valid: false,
      error: `This room fits up to ${room.capacity} guest(s). Reduce guest count or pick a bigger room.`,
    }
  }
  return { valid: true, error: null }
}

// Checks ONE room against ALL existing (non-cancelled) bookings.
// excludeBookingId lets the admin/staff edit an existing booking
// without it conflicting with itself.
export function isRoomAvailable(roomId, bookings, searchWindow, excludeBookingId = null) {
  const inDT = toDateTime(searchWindow.checkInDate, searchWindow.checkInTime)
  const outDT = toDateTime(searchWindow.checkOutDate, searchWindow.checkOutTime)
  if (!inDT || !outDT) return { available: false, conflict: null }

  const conflict = bookings.find((b) => {
    if (b.roomId !== roomId) return false
    if (b.status === 'cancelled') return false
    if (excludeBookingId && b.id === excludeBookingId) return false
    const exIn = toDateTime(b.checkInDate, b.checkInTime)
    const exOut = toDateTime(b.checkOutDate, b.checkOutTime)
    if (!exIn || !exOut) return false
    return rangesOverlap(inDT, outDT, exIn, exOut)
  })

  return { available: !conflict, conflict: conflict || null }
}

// Filters rooms by type / floor / guest capacity, then tags each
// with live availability for the requested date/time window.
export function searchRooms(rooms, bookings, criteria) {
  const { type, floor, guests, checkInDate, checkInTime, checkOutDate, checkOutTime } = criteria

  const inDT = toDateTime(checkInDate, checkInTime)
  const outDT = toDateTime(checkOutDate, checkOutTime)
  const hasValidWindow = !!inDT && !!outDT && outDT.getTime() > inDT.getTime()

  return rooms
    .filter((r) => !type || type === 'All' || r.type === type)
    .filter((r) => !floor || floor === 'All' || String(r.floor) === String(floor))
    .filter((r) => !guests || r.capacity >= Number(guests))
    .map((r) => {
      if (!hasValidWindow) {
        return { ...r, available: null, conflict: null }
      }
      const { available, conflict } = isRoomAvailable(r.id, bookings, {
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime,
      })
      return { ...r, available, conflict }
    })
}
