import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Sidebar from './Sidebar'

const API_BASE = 'http://localhost:5000'

export default function Department() {
    const [departments, setDepartments] = useState([])
    const [newDepartment, setNewDepartment] = useState({ DepartementCode: '', DepartementName: '', GrossSalary: '' })

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchDepartments()
    }, [])

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/departments`)
            setDepartments(res.data.departments)
        } catch (error) {
            console.error('Error fetching departments:', error)
            toast.error('Unable to load departments')
        }
    }

    const handleAddDepartment = async e => {
        e.preventDefault()
        if (!newDepartment.DepartementCode || !newDepartment.DepartementName || !newDepartment.GrossSalary) {
            toast.error('Please fill all department fields')
            return
        }
        try {
            const res = await axios.post(`${API_BASE}/api/departments`, {
                DepartementCode: newDepartment.DepartementCode,
                DepartementName: newDepartment.DepartementName,
                GrossSalary: Number(newDepartment.GrossSalary)
            })
            setDepartments([...departments, res.data.department])
            setNewDepartment({ DepartementCode: '', DepartementName: '', GrossSalary: '' })
            toast.success(res.data.msg)
        } catch (error) {
            console.error('Error adding department:', error)
            toast.error(error.response?.data?.error || 'Failed to add department')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Sidebar />
            <div className="md:ml-64 p-4 md:p-8">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
                    <h1 className="text-4xl font-bold text-slate-900">Department Management</h1>
                    <p className="text-slate-600 mt-2">Manage smart park departments and gross salaries</p>
                </div>

                <div className="grid gap-8 xl:grid-cols-2">
                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h3 className="text-2xl font-bold mb-4">Add Department</h3>
                        <form onSubmit={handleAddDepartment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Department Code (ex. CW, ST)</label>
                                <input
                                    type="text"
                                    value={newDepartment.DepartementCode}
                                    onChange={e => setNewDepartment({ ...newDepartment, DepartementCode: e.target.value })}
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={newDepartment.DepartementName}
                                    onChange={e => setNewDepartment({ ...newDepartment, DepartementName: e.target.value })}
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Gross Salary (RWF)</label>
                                <input
                                    type="number"
                                    value={newDepartment.GrossSalary}
                                    onChange={e => setNewDepartment({ ...newDepartment, GrossSalary: e.target.value })}
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow hover:bg-indigo-700"
                            >
                                Add Department
                            </button>
                        </form>
                    </div>

                    {/* List */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-hidden">
                        <h3 className="text-2xl font-bold mb-4">Department List</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-indigo-50 text-indigo-900 border-b">
                                        <th className="p-4 font-semibold">Code</th>
                                        <th className="p-4 font-semibold">Name</th>
                                        <th className="p-4 font-semibold text-right">Gross Salary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {departments.map(dept => (
                                        <tr key={dept._id} className="hover:bg-slate-50">
                                            <td className="p-4">{dept.DepartementCode}</td>
                                            <td className="p-4">{dept.DepartementName}</td>
                                            <td className="p-4 text-right font-medium">{dept.GrossSalary.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {departments.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-4 text-center text-slate-500">No departments found</td>
                                        </tr>
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
