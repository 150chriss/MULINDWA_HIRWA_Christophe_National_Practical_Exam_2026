import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Sidebar from './Sidebar'

const API_BASE = 'http://localhost:5000'

export default function Salary() {
    const [salaries, setSalaries] = useState([])
    const [employees, setEmployees] = useState([])
    const [editId, setEditId] = useState(null)

    const [formData, setFormData] = useState({ employee: '', month: '', TotalDeduction: '' })

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchEmployees()
        fetchSalaries()
    }, [])

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/employees`)
            setEmployees(res.data.employees)
            if (res.data.employees.length > 0) {
                setFormData(prev => ({ ...prev, employee: res.data.employees[0]._id }))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchSalaries = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/salaries`)
            setSalaries(res.data.salaries)
        } catch (error) {
            console.error(error)
            toast.error('Unable to load salaries')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (editId) {
                const res = await axios.put(`${API_BASE}/api/salaries/${editId}`, { TotalDeduction: Number(formData.TotalDeduction) })
                toast.success(res.data.msg)
                setEditId(null)
            } else {
                const res = await axios.post(`${API_BASE}/api/salaries`, {
                    employee: formData.employee,
                    month: formData.month,
                    TotalDeduction: Number(formData.TotalDeduction)
                })
                toast.success(res.data.msg)
            }
            setFormData({ employee: employees[0]?._id || '', month: '', TotalDeduction: '' })
            fetchSalaries()
        } catch (error) {
            toast.error('Operation failed')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await axios.delete(`${API_BASE}/api/salaries/${id}`)
            toast.success(res.data.msg)
            fetchSalaries()
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    const startEdit = (sal) => {
        setEditId(sal._id)
        setFormData({
            employee: sal.employee._id,
            month: sal.month,
            TotalDeduction: sal.TotalDeduction
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Sidebar />
            <div className="md:ml-64 p-4 md:p-8">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
                    <h1 className="text-4xl font-bold text-slate-900">Salary & Payroll Management</h1>
                    <p className="text-slate-600 mt-2">Manage employee deductions and dispatch payroll records</p>
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                    {/* Form */}
                    <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <h3 className="text-2xl font-bold mb-4">{editId ? 'Edit Salary' : 'Add Salary'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block text-sm font-semibold">Employee</label>
                            <select name="employee" value={formData.employee} onChange={handleChange} disabled={!!editId} required className="w-full rounded-xl border-2 px-3 py-2 bg-white disabled:bg-slate-100">
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.FirstName} {emp.LastName}</option>
                                ))}
                            </select>

                            <label className="block text-sm font-semibold">Month</label>
                            <input type="month" name="month" value={formData.month} onChange={handleChange} disabled={!!editId} required className="w-full rounded-xl border-2 px-3 py-2 disabled:bg-slate-100" />

                            <label className="block text-sm font-semibold">Total Deduction (RWF)</label>
                            <input type="number" name="TotalDeduction" value={formData.TotalDeduction} onChange={handleChange} required className="w-full rounded-xl border-2 px-3 py-2" />

                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700">{editId ? 'Update' : 'Add'}</button>
                                {editId && <button type="button" onClick={() => { setEditId(null); setFormData({ employee: employees[0]?._id, month: '', TotalDeduction: '' }) }} className="rounded-xl bg-slate-300 px-4 py-3 font-bold text-slate-800 hover:bg-slate-400">Cancel</button>}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 overflow-hidden">
                        <h3 className="text-2xl font-bold mb-4">Salary Records</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-indigo-50 text-indigo-900 border-b">
                                        <th className="p-3">Employee</th>
                                        <th className="p-3">Month</th>
                                        <th className="p-3 text-right">Gross (RWF)</th>
                                        <th className="p-3 text-right">Deduction (RWF)</th>
                                        <th className="p-3 text-right">Net (RWF)</th>
                                        <th className="p-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {salaries.map(sal => (
                                        <tr key={sal._id} className="hover:bg-slate-50">
                                            <td className="p-3">{sal.employee?.FirstName} {sal.employee?.LastName}</td>
                                            <td className="p-3 font-medium">{sal.month}</td>
                                            <td className="p-3 text-right">{sal.GlossSalary?.toLocaleString()}</td>
                                            <td className="p-3 text-right text-red-500">-{sal.TotalDeduction?.toLocaleString()}</td>
                                            <td className="p-3 text-right font-bold text-emerald-600">{sal.NetSalary?.toLocaleString()}</td>
                                            <td className="p-3 text-center space-x-2">
                                                <button onClick={() => startEdit(sal)} className="text-blue-500 hover:text-blue-700 font-bold">✎ Edit</button>
                                                <button onClick={() => handleDelete(sal._id)} className="text-red-500 hover:text-red-700 font-bold">🗑 Del</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {salaries.length === 0 && (
                                        <tr><td colSpan="6" className="p-4 text-center text-slate-500">No salary records.</td></tr>
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
