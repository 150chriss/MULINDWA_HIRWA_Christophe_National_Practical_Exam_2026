import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Product from './Product'
import Sales from './Sales'
import Sidebar from './Sidebar'

const API_BASE = 'http://localhost:5000'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [productEditId, setProductEditId] = useState(null)
  const [saleEditId, setSaleEditId] = useState(null)
  const [productForm, setProductForm] = useState({ product_name: '', price: '', quantity: '' })
  const [saleForm, setSaleForm] = useState({ item: '', amount: '', date: '' })
  const [newProduct, setNewProduct] = useState({ product_name: '', price: '', quantity: '' })
  const [newSale, setNewSale] = useState({ item: '', amount: '', date: '' })

  useEffect(() => {
    fetchProducts()
    fetchSales()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`)
      setProducts(res.data.products.map(product => ({
        id: product._id,
        product_name: product.product_name,
        price: product.price,
        quantity: product.quantity
      })))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Unable to load products')
    }
  }

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_BASE}/sales`)
      setSales(res.data.sales.map(sale => ({
        id: sale._id,
        item: sale.item,
        amount: sale.amount,
        date: sale.date ? new Date(sale.date).toISOString().slice(0, 10) : ''
      })))
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast.error('Unable to load sales')
    }
  }

  const handleProductEdit = product => {
    setProductEditId(product.id)
    setProductForm({
      product_name: product.product_name,
      price: product.price,
      quantity: product.quantity
    })
  }

  const handleProductSave = async id => {
    try {
      const res = await axios.put(`${API_BASE}/products/${id}`, {
        product_name: productForm.product_name,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity)
      })
      setProducts(products.map(prod => prod.id === id ? {
        id,
        product_name: res.data.product.product_name,
        price: res.data.product.price,
        quantity: res.data.product.quantity
      } : prod))
      setProductEditId(null)
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleProductDelete = async id => {
    try {
      const res = await axios.delete(`${API_BASE}/products/${id}`)
      setProducts(products.filter(prod => prod.id !== id))
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleSaleEdit = sale => {
    setSaleEditId(sale.id)
    setSaleForm({
      item: sale.item,
      amount: sale.amount,
      date: sale.date
    })
  }

  const handleSaleSave = async id => {
    try {
      const res = await axios.put(`${API_BASE}/sales/${id}`, {
        item: saleForm.item,
        amount: Number(saleForm.amount),
        date: saleForm.date
      })
      setSales(sales.map(s => s.id === id ? {
        id,
        item: res.data.sale.item,
        amount: res.data.sale.amount,
        date: res.data.sale.date ? new Date(res.data.sale.date).toISOString().slice(0, 10) : ''
      } : s))
      setSaleEditId(null)
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error updating sale:', error)
      toast.error('Failed to update sale')
    }
  }

  const handleSaleDelete = async id => {
    try {
      const res = await axios.delete(`${API_BASE}/sales/${id}`)
      setSales(sales.filter(sale => sale.id !== id))
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error deleting sale:', error)
      toast.error('Failed to delete sale')
    }
  }

  const handleAddProduct = async e => {
    e.preventDefault()
    if (!newProduct.product_name || !newProduct.price || !newProduct.quantity) {
      toast.error('Please fill all product fields')
      return
    }
    try {
      const res = await axios.post(`${API_BASE}/products`, {
        product_name: newProduct.product_name,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity)
      })
      setProducts([...products, {
        id: res.data.product._id,
        product_name: res.data.product.product_name,
        price: res.data.product.price,
        quantity: res.data.product.quantity
      }])
      setNewProduct({ product_name: '', price: '', quantity: '' })
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    }
  }

  const handleAddSale = async e => {
    e.preventDefault()
    if (!newSale.item || !newSale.amount || !newSale.date) {
      toast.error('Please fill all sale fields')
      return
    }
    try {
      const res = await axios.post(`${API_BASE}/sales`, {
        item: newSale.item,
        amount: Number(newSale.amount),
        date: newSale.date
      })
      setSales([...sales, {
        id: res.data.sale._id,
        item: res.data.sale.item,
        amount: res.data.sale.amount,
        date: res.data.sale.date ? new Date(res.data.sale.date).toISOString().slice(0, 10) : ''
      }])
      setNewSale({ item: '', amount: '', date: '' })
      toast.success(res.data.msg)
    } catch (error) {
      console.error('Error adding sale:', error)
      toast.error('Failed to add sale')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Sidebar />

      <div className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Welcome to</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">Product & Sales Hub</h1>
            <p className="text-slate-600 mt-2 text-lg">Manage your inventory and track sales in real-time</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Products</p>
                <h3 className="text-4xl font-bold mt-2">{products.length}</h3>
              </div>
              <div className="text-6xl opacity-30">📦</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Sales</p>
                <h3 className="text-4xl font-bold mt-2">{sales.length}</h3>
              </div>
              <div className="text-6xl opacity-30">🛒</div>
            </div>
          </div>
        </div>

        {/* Forms and Tables */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Products Section */}
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">➕</span>
                <h3 className="text-2xl font-bold text-slate-900">Add Product</h3>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.product_name}
                    onChange={e => setNewProduct({ ...newProduct, product_name: e.target.value })}
                    placeholder="e.g., Laptop, Mouse, Keyboard..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-95"
                >
                  ✨ Add Product
                </button>
              </form>
            </div>

            {/* Products Table */}
            <Product
              products={products}
              editId={productEditId}
              form={productForm}
              setForm={setProductForm}
              onEdit={handleProductEdit}
              onSave={handleProductSave}
              onCancel={() => setProductEditId(null)}
              onDelete={handleProductDelete}
            />
          </div>

          {/* Sales Section */}
          <div className="space-y-6">
            {/* Add Sale Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">➕</span>
                <h3 className="text-2xl font-bold text-slate-900">Add Sale</h3>
              </div>
              <form onSubmit={handleAddSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={newSale.item}
                    onChange={e => setNewSale({ ...newSale, item: e.target.value })}
                    placeholder="e.g., Office Supplies Bundle..."
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newSale.amount}
                      onChange={e => setNewSale({ ...newSale, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newSale.date}
                      onChange={e => setNewSale({ ...newSale, date: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95"
                >
                  ✨ Add Sale
                </button>
              </form>
            </div>

            {/* Sales Table */}
            <Sales
              sales={sales}
              editId={saleEditId}
              form={saleForm}
              setForm={setSaleForm}
              onEdit={handleSaleEdit}
              onSave={handleSaleSave}
              onCancel={() => setSaleEditId(null)}
              onDelete={handleSaleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  )
}