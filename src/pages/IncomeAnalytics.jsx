import { useMemo, useState } from 'react'
import { getBookings } from '../utils/storage'
import StatCard from '../components/StatCard'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function IncomeAnalytics() {
  const [dailyDate, setDailyDate] = useState(todayISO())
  const bookings = useMemo(() => getBookings(), [])
  const active = useMemo(() => bookings.filter((b) => b.status !== 'cancelled'), [bookings])

  const totalIncome = active.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalBookings = bookings.length
  const cancelledCount = bookings.length - active.length

  const dailyIncome = active
    .filter((b) => b.checkInDate === dailyDate)
    .reduce((sum, b) => sum + b.totalPrice, 0)
  const dailyBookingsCount = active.filter((b) => b.checkInDate === dailyDate).length

  const roomWise = useMemo(() => {
    const map = {}
    active.forEach((b) => {
      const key = `${b.roomNumber} (${b.roomType})`
      map[key] = (map[key] || 0) + b.totalPrice
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [active])
  const maxRoomIncome = roomWise.length ? Math.max(...roomWise.map((r) => r[1])) : 0

  const typeWise = useMemo(() => {
    const map = {}
    active.forEach((b) => {
      map[b.roomType] = (map[b.roomType] || 0) + b.totalPrice
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [active])
  const maxTypeIncome = typeWise.length ? Math.max(...typeWise.map((t) => t[1])) : 0

  const avgNights = active.length
    ? (active.reduce((sum, b) => sum + b.nights, 0) / active.length).toFixed(1)
    : 0

  const bySource = useMemo(() => {
    const map = { staff: 0, user: 0, admin: 0 }
    active.forEach((b) => {
      map[b.bookedBy] = (map[b.bookedBy] || 0) + 1
    })
    return map
  }, [active])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Income Analytics</h1>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Income" value={`₹${totalIncome.toLocaleString('en-IN')}`} />
        <StatCard label="Total Bookings" value={totalBookings} sub={`${cancelledCount} cancelled`} />
        <StatCard label="Average Stay" value={`${avgNights} nights`} />
        <StatCard
          label="Bookings Source"
          value={`${bySource.user || 0} user / ${bySource.staff || 0} staff`}
        />
      </div>

      <div className="analytics-section">
        <h2 className="section-title">Daily Income</h2>
        <label className="field field-inline">
          <span>Select Date</span>
          <input type="date" value={dailyDate} onChange={(e) => setDailyDate(e.target.value)} />
        </label>
        <div className="stat-grid">
          <StatCard label={`Income on ${dailyDate}`} value={`₹${dailyIncome.toLocaleString('en-IN')}`} />
          <StatCard label="Bookings that day" value={dailyBookingsCount} />
        </div>
      </div>

      <div className="analytics-section">
        <h2 className="section-title">Room-wise Income</h2>
        {roomWise.length === 0 ? (
          <p className="empty-state">No income recorded yet.</p>
        ) : (
          <div className="bar-chart">
            {roomWise.map(([label, value]) => (
              <div className="bar-row" key={label}>
                <div className="bar-label">{label}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${maxRoomIncome ? (value / maxRoomIncome) * 100 : 0}%` }}
                  />
                </div>
                <div className="bar-value">₹{value.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="analytics-section">
        <h2 className="section-title">Income by Room Type</h2>
        {typeWise.length === 0 ? (
          <p className="empty-state">No income recorded yet.</p>
        ) : (
          <div className="bar-chart">
            {typeWise.map(([label, value]) => (
              <div className="bar-row" key={label}>
                <div className="bar-label">{label}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill bar-fill-alt"
                    style={{ width: `${maxTypeIncome ? (value / maxTypeIncome) * 100 : 0}%` }}
                  />
                </div>
                <div className="bar-value">₹{value.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
