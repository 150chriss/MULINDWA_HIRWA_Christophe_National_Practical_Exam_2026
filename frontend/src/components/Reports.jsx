import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Sidebar from './Sidebar'

const API_BASE = 'http://localhost:5000'

export default function Reports() {
    const [month, setMonth] = useState('')
    const [report, setReport] = useState([])
    const [searched, setSearched] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [])

    const handleGenerateReport = async (e) => {
        e.preventDefault()
        if (!month) return;
        try {
            const res = await axios.get(`${API_BASE}/api/reports/payroll/${month}`)
            setReport(res.data.report)
            setSearched(true)
            if (res.data.report.length === 0) toast.error('No records for this month')
        } catch (error) {
            toast.error('Failed to generate report')
        }
    }

    const printReport = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Sidebar />
            <div className="md:ml-64 p-4 md:p-8">
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600 print:hidden">
                    <h1 className="text-4xl font-bold text-slate-900">Monthly Payroll Report</h1>
                    <p className="text-slate-600 mt-2">Generate and view the payroll report of a given month</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <form onSubmit={handleGenerateReport} className="flex gap-4 mb-8 print:hidden items-end">
                        <div className="flex-1 max-w-sm">
                            <label className="block text-sm font-semibold mb-2">Select Month</label>
                            <input type="month" value={month} onChange={e => setMonth(e.target.value)} required className="w-full rounded-xl border-2 px-3 py-2" />
                        </div>
                        <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 h-[46px]">Generate</button>
                        <button type="button" onClick={printReport} disabled={!searched} className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 h-[46px] disabled:bg-slate-300">🖨 Print</button>
                    </form>

                    {searched && (
                        <div id="print-area">
                            <h2 className="text-2xl font-bold text-center mb-6">Payroll Report - {month}</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm border-2 border-slate-200">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-200">
                                            <th className="p-3 border-r-2 border-slate-200">First Name</th>
                                            <th className="p-3 border-r-2 border-slate-200">Last Name</th>
                                            <th className="p-3 border-r-2 border-slate-200">Position</th>
                                            <th className="p-3 border-r-2 border-slate-200">Department</th>
                                            <th className="p-3 text-right">Net Salary (RWF)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {report.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="p-3 border-r-2 border-slate-200">{row.FirstName}</td>
                                                <td className="p-3 border-r-2 border-slate-200">{row.LastName}</td>
                                                <td className="p-3 border-r-2 border-slate-200">{row.Position}</td>
                                                <td className="p-3 border-r-2 border-slate-200 font-medium">{row.Departement}</td>
                                                <td className="p-3 text-right font-bold text-emerald-700">{row.NetSalary?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {report.length === 0 && (
                                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No data available for {month}</td></tr>
                                        )}
                                    </tbody>
                                    {report.length > 0 && (
                                        <tfoot>
                                            <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-right">
                                                <td colSpan="4" className="p-3 border-r-2 border-slate-200">Total Expenditure:</td>
                                                <td className="p-3 text-emerald-800">{report.reduce((sum, curr) => sum + curr.NetSalary, 0).toLocaleString()} RWF</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx="true">{`
        @media print {
          .print\\:hidden { display: none !important; }
          .md\\:ml-64 { margin-left: 0 !important; border: 0 !important; }
          .bg-gradient-to-br { background: white !important; }
          .shadow-lg { box-shadow: none !important; }
        }
      `}</style>
        </div>
    )
}
