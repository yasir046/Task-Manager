import React, { useState, useEffect, useRef } from 'react'
import { Search, Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'
import api from '../api/axios'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!debouncedSearch.trim()) { setResults([]); setShowResults(false); return }
    api.get('/tasks', { params: { search: debouncedSearch } })
      .then(res => { setResults(res.data.slice(0, 8)); setShowResults(true) })
      .catch(() => {})
  }, [debouncedSearch])

  useEffect(() => {
    const handler = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.email?.charAt(0).toUpperCase() || '?'

  return (
    <header style={{ background: '#FFFFFF', borderBottom: '1px solid #BBF7D0', minHeight: 60 }}
      className="px-4 lg:px-6 flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-slate-700 p-1">
        <Menu size={21} />
      </button>

      <div className="hidden sm:block flex-shrink-0">
        <p className="text-xs text-emerald-600 uppercase tracking-widest font-bold">{getGreeting()}</p>
        <p className="text-sm font-black text-slate-800 -mt-0.5 capitalize">
          {user?.role === 'admin' ? 'Admin' : 'Member'}
        </p>
      </div>
      <div className="hidden sm:block w-px h-8 bg-emerald-200 mx-1" />

      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="flex items-center border-2 border-emerald-200 px-3 py-2 gap-2 focus-within:border-emerald-500 transition-colors"
          style={{ background: '#FFFFFF' }}>
          <Search size={14} className="text-emerald-400 flex-shrink-0" />
          <input type="text" placeholder="Search tasks, teams..."
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="bg-transparent text-sm text-slate-800 placeholder:text-slate-400 w-full border-none" />
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-0 w-full shadow-lg z-50"
            style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderTop: 0 }}>
            {results.map(task => (
              <button key={task._id}
                onClick={() => { setSearch(''); setShowResults(false); navigate('/tasks') }}
                className="w-full text-left px-4 py-2.5 border-b border-emerald-50 last:border-0 hover:bg-emerald-50 transition-colors">
                <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                <p className="text-xs text-slate-400">{task.projectType} · {task.team || 'No team'}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div style={{ background: 'linear-gradient(135deg, #065F46, #059669)' }}
            className="w-8 h-8 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user?.email?.split('@')[0]}</p>
            <span className="text-white px-2 py-0.5 mt-0.5 inline-block font-bold tracking-widest uppercase"
              style={{ fontSize: 9, background: 'linear-gradient(135deg, #065F46, #059669)' }}>
              {user?.role}
            </span>
          </div>
        </div>
        <div className="w-px h-6 bg-emerald-200" />
        <button onClick={handleLogout} title="Logout"
          className="p-1.5 text-emerald-600 hover:text-orange-600 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
