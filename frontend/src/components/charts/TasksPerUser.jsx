import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

export default function TasksPerUser({ data }) {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filtered = data.filter(d =>
    d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.team?.toLowerCase().includes(search.toLowerCase())
  )
  const visible = showAll ? filtered : filtered.slice(0, 5)

  return (
    <div className="p-6" style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderTop: '3px solid #38BDF8' }}>
      <div className="flex items-center gap-3 mb-4">
        <div style={{ background: 'linear-gradient(135deg, #065F46, #4ADE80)' }} className="w-1 h-6" />
        <h2 className="text-lg font-black tracking-tight" style={{ color: '#064E3B' }}>Tasks per User</h2>
      </div>

      <div className="flex items-center border-2 px-3 py-2 mb-4 gap-2 transition-colors"
        style={{ background: '#FFFFFF', borderColor: '#6EE7B7' }}>
        <Search size={13} className="flex-shrink-0" style={{ color: '#059669' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
          className="bg-transparent text-sm placeholder:text-emerald-300 w-full border-none font-medium"
          style={{ color: '#064E3B' }} />
      </div>

      <div className="space-y-2">
        {visible.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border transition-colors"
            style={{ background: '#FFFFFF', border: '1px solid #A7F3D0' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6EE7B7'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#A7F3D0'}>
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #065F46, #059669)' }}>
              {d.user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: '#064E3B' }}>{d.user?.email?.split('@')[0]}</p>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>
                {d.user?.project} · {d.user?.team}
              </p>
              {d.tasks?.length > 0 && (
                <p className="text-xs mt-0.5 truncate" style={{ color: '#059669' }}>
                  {d.tasks.slice(0, 2).join(', ')}{d.tasks.length > 2 && ` +${d.tasks.length - 2}`}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-2xl font-black" style={{ color: '#059669' }}>{d.count}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>tasks</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="border-2 border-dashed py-8 text-center" style={{ borderColor: '#A7F3D0' }}>
            <p className="text-sm font-bold" style={{ color: '#6EE7B7' }}>No users found</p>
          </div>
        )}
      </div>

      {filtered.length > 5 && (
        <button onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest py-2 border-2 transition-colors"
          style={{ color: '#059669', borderColor: '#A7F3D0', background: '#FFFFFF' }}>
          {showAll ? <><ChevronUp size={13} /> Show Less</> : <><ChevronDown size={13} /> Show {filtered.length - 5} More</>}
        </button>
      )}
    </div>
  )
}
