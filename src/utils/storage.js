import { INITIAL_ROOMS } from '../data/initialRooms'

export const KEYS = {
  ROOMS: 'gv_rooms',
  BOOKINGS: 'gv_bookings',
  ADMIN_SESSION: 'gv_admin_session',
  STAFF_SESSION: 'gv_staff_session',
  USER_SESSION: 'gv_user_session',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Runs once on app start. Seeds rooms if this is the first ever visit.
export function initStorage() {
  if (localStorage.getItem(KEYS.ROOMS) === null) {
    write(KEYS.ROOMS, INITIAL_ROOMS)
  }
  if (localStorage.getItem(KEYS.BOOKINGS) === null) {
    write(KEYS.BOOKINGS, [])
  }
}

export function getRooms() {
  return read(KEYS.ROOMS, [])
}

export function saveRooms(rooms) {
  write(KEYS.ROOMS, rooms)
}

export function getBookings() {
  return read(KEYS.BOOKINGS, [])
}

export function saveBookings(bookings) {
  write(KEYS.BOOKINGS, bookings)
}

export function getSession(key) {
  return read(key, null)
}

export function setSession(key, value) {
  if (value === null) {
    localStorage.removeItem(key)
  } else {
    write(key, value)
  }
}
