import React from 'react'

export default function Sales({ sales, editId, form, setForm, onEdit, onSave, onCancel, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🛒</span>
          <div>
            <h2 className="text-2xl font-bold">Sales</h2>
            <p className="text-emerald-100 text-sm">Track and manage sales transactions</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest font-bold text-slate-600 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sales.map((sale, idx) => (
              <tr key={sale.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-emerald-50 transition-colors`}>
                <td className="px-6 py-4 font-medium">
                  {editId === sale.id ? (
                    <input
                      type="text"
                      value={form.item}
                      onChange={e => setForm({ ...form, item: e.target.value })}
                      className="w-full rounded-lg border-2 border-emerald-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="text-slate-900">{sale.item}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === sale.id ? (
                    <input
                      type="number"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      className="w-full rounded-lg border-2 border-emerald-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="font-bold text-emerald-600">${sale.amount}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === sale.id ? (
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-lg border-2 border-emerald-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold text-xs">{sale.date}</span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {editId === sale.id ? (
                    <>
                      <button
                        onClick={() => onSave(sale.id)}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-emerald-600 hover:shadow-md active:scale-95"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={onCancel}
                        className="rounded-lg border-2 border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition-all duration-200 hover:bg-slate-100 active:scale-95"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(sale)}
                        className="rounded-lg bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 transition-all duration-200 hover:bg-emerald-200 hover:shadow-md active:scale-95"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(sale.id)}
                        className="rounded-lg bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-rose-600 hover:shadow-md active:scale-95"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">📭</span>
            <p className="text-slate-500 mt-4 font-medium">No sales yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </section>
  )
}

