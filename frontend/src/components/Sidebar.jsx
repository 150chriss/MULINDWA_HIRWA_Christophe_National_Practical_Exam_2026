import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { handleLogout } from '../utils/logoutHandler'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoutClick = async () => {
    const success = await handleLogout()
    if (success) {
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  const menuItems = [
    { icon: '🏢', label: 'Department', path: '/department' },
    { icon: '👥', label: 'Employee', path: '/employee' },
    { icon: '💰', label: 'Salary', path: '/salary' },
    { icon: '📊', label: 'Reports', path: '/reports' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
          } z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-indigo-500">
          <div className={`text-3xl font-bold ${isOpen ? '' : 'text-2xl'}`}>
            {isOpen ? '💼 ProMgmt' : '💼'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-indigo-500 shadow-lg font-bold'
                  : 'hover:bg-indigo-500 hover:shadow-lg'
                } ${isOpen ? 'justify-start' : 'justify-center'}`}
              title={!isOpen ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-500">
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 transition-all duration-200 font-medium text-sm ${isOpen ? 'justify-start' : 'justify-center'
              }`}
          >
            <span className="text-lg">🚪</span>
            {isOpen && <span>Logout</span>}
          </button>

          {/* User Info */}
          {isOpen && (
            <div className="mt-4 pt-4 border-t border-indigo-500">
              <p className="text-xs text-indigo-200">Logged in as</p>
              <p className="text-sm font-semibold truncate mt-1">
                {localStorage.getItem('userName') || 'User'}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-20'}`}></div>
    </>
  )
}
