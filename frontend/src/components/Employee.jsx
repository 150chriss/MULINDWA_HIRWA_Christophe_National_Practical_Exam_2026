import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Sidebar from './Sidebar'

const API_BASE = 'http://localhost:5000'

export default function Employee() {
    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [newEmployee, setNewEmployee] = useState({
        employeeNumber: '', FirstName: '', LastName: '', Position: '',
        Address: '', Telephone: '', Gender: 'Male', hiredDate: '', department: ''
    })

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchDepartments()
        fetchEmployees()
    }, [])

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/departments`)
            setDepartments(res.data.departments)
            if (res.data.departments.length > 0) {
                setNewEmployee(prev => ({ ...prev, department: res.data.departments[0]._id }))
            }
        } catch (error) {
            console.error('Error fetching departments:', error)
        }
    }

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/employees`)
            setEmployees(res.data.employees)
        } catch (error) {
            console.error('Error fetching employees:', error)
            toast.error('Unable to load employees')
        }
    }

    const handleAddEmployee = async e => {
        e.preventDefault()
        try {
            const res = await axios.post(`${API_BASE}/api/employees`, newEmployee)
            setEmployees([...employees, res.data.employee])
            toast.success(res.data.msg)
        } catch (error) {
            console.error('Error adding employee:', error)
            toast.error(error.response?.data?.error || 'Failed to add employee')
        }
    }

    const handleChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Sidebar />
            <div className="md:ml-64 p-4 md:p-8">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
                    <h1 className="text-4xl font-bold text-slate-900">Employee Management</h1>
                    <p className="text-slate-600 mt-2">Manage SmartPark human resources digitally</p>
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                    {/* Form */}
                    <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h3 className="text-2xl font-bold mb-4">Add Employee</h3>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <input name="employeeNumber" value={newEmployee.employeeNumber} onChange={handleChange} placeholder="Employee No" required className="w-full rounded-xl border-2 px-3 py-2" />
                            <div className="grid grid-cols-2 gap-2">
                                <input name="FirstName" value={newEmployee.FirstName} onChange={handleChange} placeholder="First Name" required className="w-full rounded-xl border-2 px-3 py-2" />
                                <input name="LastName" value={newEmployee.LastName} onChange={handleChange} placeholder="Last Name" required className="w-full rounded-xl border-2 px-3 py-2" />
                            </div>
                            <input name="Position" value={newEmployee.Position} onChange={handleChange} placeholder="Position" required className="w-full rounded-xl border-2 px-3 py-2" />
                            <input name="Address" value={newEmployee.Address} onChange={handleChange} placeholder="Address" required className="w-full rounded-xl border-2 px-3 py-2" />
                            <input name="Telephone" value={newEmployee.Telephone} onChange={handleChange} placeholder="Telephone" required className="w-full rounded-xl border-2 px-3 py-2" />

                            <div className="grid grid-cols-2 gap-2">
                                <select name="Gender" value={newEmployee.Gender} onChange={handleChange} className="w-full rounded-xl border-2 px-3 py-2 bg-white">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <input type="date" name="hiredDate" value={newEmployee.hiredDate} onChange={handleChange} required className="w-full rounded-xl border-2 px-3 py-2" />
                            </div>

                            <select name="department" value={newEmployee.department} onChange={handleChange} required className="w-full rounded-xl border-2 px-3 py-2 bg-white">
                                {departments.map(d => (
                                    <option key={d._id} value={d._id}>{d.DepartementName} ({d.DepartementCode})</option>
                                ))}
                            </select>

                            <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">Add Employee</button>
                        </form>
                    </div>

                    {/* List */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-hidden">
                        <h3 className="text-2xl font-bold mb-4">Employee Directory</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-indigo-50 text-indigo-900 border-b">
                                        <th className="p-3">Emp No</th>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Position</th>
                                        <th className="p-3">Telephone</th>
                                        <th className="p-3">Date Hired</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employees.map(emp => (
                                        <tr key={emp._id} className="hover:bg-slate-50">
                                            <td className="p-3 font-medium">{emp.employeeNumber}</td>
                                            <td className="p-3">{emp.FirstName} {emp.LastName}</td>
                                            <td className="p-3">{emp.Position}</td>
                                            <td className="p-3">{emp.Telephone}</td>
                                            <td className="p-3">{new Date(emp.hiredDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr><td colSpan="5" className="p-4 text-center text-slate-500">No employees registered yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
