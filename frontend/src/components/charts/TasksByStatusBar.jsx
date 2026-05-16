import React from 'react'

const STATUS_CONFIG = [
  { key: 'Done',        color: '#4ADE80', label: 'Done' },
  { key: 'In Progress', color: '#7C3AED', label: 'In Progress' },
  { key: 'Overdue',     color: '#FB923C', label: 'Overdue' },
  { key: 'To Do',       color: '#38BDF8', label: 'To Do' },
]

export default function TasksByStatusBar({ data }) {
  const map = Object.fromEntries(data.map(d => [d._id, d.count]))
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="p-6" style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderTop: '3px solid #059669' }}>
      <div className="flex items-center gap-3 mb-5">
        <div style={{ background: 'linear-gradient(135deg, #065F46, #4ADE80)' }} className="w-1 h-6" />
        <h2 className="text-lg font-black tracking-tight" style={{ color: '#064E3B' }}>Tasks by Status</h2>
        {total > 0 && <span className="ml-auto text-xs font-black uppercase tracking-widest" style={{ color: '#6EE7B7' }}>{total} total</span>}
      </div>
      {total > 0 ? (
        <>
          <div className="flex h-5 mb-4 gap-0.5 overflow-hidden">
            {STATUS_CONFIG.map(({ key, color }) => {
              const count = map[key] || 0
              const pct = (count / total) * 100
              if (!pct) return null
              return (
                <div key={key} style={{ width: `${pct}%`, background: color }}
                  title={`${key}: ${count}`} className="transition-all duration-500" />
              )
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_CONFIG.map(({ key, color, label }) => (
              <div key={key} className="px-3 py-2.5"
                style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderLeft: `3px solid ${color}` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#065F46' }}>{label}</p>
                <p className="text-2xl font-black" style={{ color }}>{map[key] || 0}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm font-medium" style={{ color: '#6EE7B7' }}>No tasks found</p>
      )}
    </div>
  )
}
