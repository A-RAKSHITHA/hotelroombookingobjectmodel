// Base catalogue used only to seed localStorage the very first time the app runs.
// Capacity and price are fixed per room type as specified by the hotel.
export const ROOM_TYPE_INFO = {
  Standard: { capacity: 3, price: 2000 },
  Grand: { capacity: 2, price: 3000 },
  Deluxe: { capacity: 3, price: 4000 },
  Suite: { capacity: 4, price: 6000 },
}

const FLOOR_LAYOUT = {
  1: ['Standard', 'Grand', 'Deluxe', 'Suite'],
  2: ['Standard', 'Grand', 'Deluxe', 'Suite'],
  3: ['Standard', 'Grand', 'Deluxe', 'Suite'],
}

function buildInitialRooms() {
  const rooms = []
  Object.entries(FLOOR_LAYOUT).forEach(([floor, types]) => {
    types.forEach((type, idx) => {
      const number = Number(floor) * 100 + (idx + 1)
      const info = ROOM_TYPE_INFO[type]
      rooms.push({
        id: `room-${number}`,
        number,
        floor: Number(floor),
        type,
        capacity: info.capacity,
        price: info.price,
      })
    })
  })
  return rooms
}

export const INITIAL_ROOMS = buildInitialRooms()
