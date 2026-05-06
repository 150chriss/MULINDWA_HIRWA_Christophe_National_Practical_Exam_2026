import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Department from './components/Department'
import Employee from './components/Employee'
import Salary from './components/Salary'
import Reports from './components/Reports'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/department' element={<ProtectedRoute><Department /></ProtectedRoute>} />
          <Route path='/employee' element={<ProtectedRoute><Employee /></ProtectedRoute>} />
          <Route path='/salary' element={<ProtectedRoute><Salary /></ProtectedRoute>} />
          <Route path='/reports' element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  )
}
