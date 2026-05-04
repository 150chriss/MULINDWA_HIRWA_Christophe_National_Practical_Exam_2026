import React from 'react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Register() {
const [form, setForm] = React.useState({
    firstname:"",
    lastname:"",
    email:"",
    password:""
})
const[loading, setLoading]=useState(false)
// Handle change

const handlechange= (e)=>{
    setForm({...form,[e.target.name]:e.target.value})

}
// handle submit

const handlesubmit = async (e)=>{
    e.preventDefault();
    setLoading(true)
    try {
        const res = await axios.post("http://localhost:5000/auth/register",form)
        console.log(res.data.msg)
        toast.success(res.data.msg)
        setForm({ firstname: "", lastname: "", email: "", password: "" })
    } catch (error) {
        console.error('Error registering user:', error)
        toast.error(error.response?.data?.error || 'Failed to register user. Please try again.')
    } finally {
        setLoading(false)
    }
}
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">   
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Register</h1>
              <form onSubmit={handlesubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={form.firstname}
                    onChange={handlechange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="first name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={form.lastname}
                    onChange={handlechange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="last name"
                  />
                </div>
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
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6 ">
                  {loading ? 'Processing...' : 'Register'}
                </button>
                <p className="text-center text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login here</Link></p>
              </form>
        </div>
        
    </div>
  )
}
