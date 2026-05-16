import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <aside
      style={{ background: 'linear-gradient(180deg, #052e16 0%, #064E3B 100%)' }}
      className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex-shrink-0 flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                style={{ background: 'linear-gradient(135deg, #4ADE80, #059669)' }}
                className="w-7 h-7 flex items-center justify-center"
              >
                <span className="text-white font-black text-xs">E</span>
              </div>
              <span className="text-white font-black text-sm tracking-wide uppercase">Ethara</span>
            </div>
            <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">
              {isAdmin ? 'Admin Panel' : 'Member Panel'}
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white p-1">
            <X size={17} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {isAdmin && (
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all relative
              ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    style={{ background: 'linear-gradient(180deg, #4ADE80, #059669)' }}
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                  />
                )}
                {isActive && (
                  <span className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
                )}
                <LayoutDashboard size={17} />
                <span className="tracking-wide">Dashboard</span>
              </>
            )}
          </NavLink>
        )}
        <NavLink
          to="/tasks"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all relative
            ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  style={{ background: 'linear-gradient(180deg, #4ADE80, #059669)' }}
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                />
              )}
              {isActive && (
                <span className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
              )}
              <CheckSquare size={17} />
              <span className="tracking-wide">Tasks</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <div style={{ background: 'linear-gradient(90deg, #4ADE80, #059669)' }} className="h-0.5 mb-3" />
        <p className="text-white/20 text-xs tracking-widest uppercase">Ethara &copy; {new Date().getFullYear()}</p>
      </div>
    </aside>
  )
}
