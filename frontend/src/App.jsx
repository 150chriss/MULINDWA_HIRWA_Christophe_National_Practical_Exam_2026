import React from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
}
