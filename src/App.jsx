import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { initStorage } from './utils/storage'
import Navbar from './components/Navbar'
import { AdminRoute, StaffRoute, UserRoute } from './components/ProtectedRoute'

import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import StaffLogin from './pages/StaffLogin'
import UserPortal from './pages/UserPortal'
import AdminDashboard from './pages/AdminDashboard'
import StaffBooking from './pages/StaffBooking'
import UserBooking from './pages/UserBooking'
import AvailabilitySearch from './pages/AvailabilitySearch'
import IncomeAnalytics from './pages/IncomeAnalytics'

export default function App() {
  useEffect(() => {
    initStorage()
  }, [])

  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/availability" element={<AvailabilitySearch />} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/user-portal" element={<UserPortal />} />

            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/income-analytics"
              element={
                <AdminRoute>
                  <IncomeAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/book/staff"
              element={
                <StaffRoute>
                  <StaffBooking />
                </StaffRoute>
              }
            />
            <Route
              path="/book/user"
              element={
                <UserRoute>
                  <UserBooking />
                </UserRoute>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Grand Villa Hotel &middot; Frontend demo &middot; No real payments are processed</p>
        </footer>
      </HashRouter>
    </AuthProvider>
  )
}
