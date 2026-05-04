import React from 'react'

export default function Product({ products, editId, form, setForm, onEdit, onSave, onCancel, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📦</span>
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-blue-100 text-sm">Manage inventory items and update product details</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-100 text-xs uppercase tracking-widest font-bold text-slate-600 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product, idx) => (
              <tr key={product.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}>
                <td className="px-6 py-4 font-medium">
                  {editId === product.id ? (
                    <input
                      type="text"
                      value={form.product_name}
                      onChange={e => setForm({ ...form, product_name: e.target.value })}
                      className="w-full rounded-lg border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-slate-900">{product.product_name}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === product.id ? (
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-lg border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="font-bold text-blue-600">${product.price}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === product.id ? (
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: e.target.value })}
                      className="w-full rounded-lg border-2 border-blue-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-xs">{product.quantity}</span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  {editId === product.id ? (
                    <>
                      <button
                        onClick={() => onSave(product.id)}
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
                        onClick={() => onEdit(product)}
                        className="rounded-lg bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700 transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-95"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
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
        {products.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">📭</span>
            <p className="text-slate-500 mt-4 font-medium">No products yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </section>
  )
}

