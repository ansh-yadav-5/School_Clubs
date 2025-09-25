import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import ClubDetail from './pages/ClubDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import LeaderDashboard from './pages/LeaderDashboard'
import { useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<PrivateRoute><LeaderDashboard /></PrivateRoute>} />
      </Routes>
    </div>
  )
}
