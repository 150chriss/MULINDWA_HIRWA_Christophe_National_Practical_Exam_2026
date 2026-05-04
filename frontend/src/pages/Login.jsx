import React from 'react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Handle change
  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setLoginError('') // Clear error when user starts typing
  }

  // Handle submit
  const handlesubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')

    // Validate form
    if (!form.email || !form.password) {
      setLoginError('Please fill in all fields')
      toast.error('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form)

      // Check if login was successful
      if (res.data && res.data.msg) {
        toast.success(res.data.msg)
        
        // Store user data in localStorage
        if (res.data.user) {
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('userName', `${res.data.user.firstname} ${res.data.user.lastname}`)
          localStorage.setItem('userEmail', res.data.user.email)
        }

        // Navigate to dashboard on successful login
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error logging in user:', error)
      
      // Handle specific error messages
      if (error.response && error.response.data) {
        if (error.response.data.error === 'User not found') {
          setLoginError('Email not registered. Please sign up first.')
          toast.error('Email not registered. Please sign up first.')
        } else if (error.response.data.error === 'Incorrect password') {
          setLoginError('Incorrect password. Please try again.')
          toast.error('Incorrect password. Please try again.')
        } else {
          setLoginError(error.response.data.error || 'Login failed. Please try again.')
          toast.error(error.response.data.error || 'Login failed. Please try again.')
        }
      } else {
        setLoginError('Connection error. Please try again.')
        toast.error('Connection error. Please try again.')
      }
      
      // Keep user on login page on failure
      // Don't navigate anywhere
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">   
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
              <form onSubmit={handlesubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handlechange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handlechange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                  {loading ? 'Processing...' : 'Login'}
                </button>
                <p className="text-center text-gray-600 text-sm">Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">Register here</Link></p>
              </form>
        </div>
        
    </div>
  )
}