import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../api/axios'

export default function AssignTaskModal({ open, onClose, onUpdated }) {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [selected, setSelected] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    Promise.all([api.get('/tasks'), api.get('/users')])
      .then(([t, u]) => { setTasks(t.data); setMembers(u.data) })
      .catch(() => toast.error('Failed to load data'))
  }, [open])

  const getCompatibleMembers = task =>
    members.filter(m => m.project === task.projectType && m.team === task.team)

  const handleAssign = async taskId => {
    const userId = selected[taskId]
    if (!userId) return toast.error('Select a member first')
    setLoading(true)
    try {
      const res = await api.patch(`/tasks/${taskId}/assign`, { userId })
      toast.success('Task assigned!')
      setTasks(prev => prev.map(t => t._id === res.data._id ? res.data : t))
      onUpdated(res.data)
    } catch { toast.error('Failed to assign') } finally { setLoading(false) }
  }

  const handleCancel = async taskId => {
    setLoading(true)
    try {
      const res = await api.patch(`/tasks/${taskId}/cancel`)
      toast.success('Assignment cancelled')
      setTasks(prev => prev.map(t => t._id === res.data._id ? res.data : t))
      onUpdated(res.data)
    } catch { toast.error('Failed to cancel') } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign Tasks" wide>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {tasks.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No tasks found</p>
        )}
        {tasks.map(task => (
          <div
            key={task._id}
            className="border border-slate-200 p-4 space-y-3 hover:border-blue-300 transition-colors"
            style={{ borderLeft: `4px solid ${task.assignmentStatus === 'Active' ? '#2563EB' : '#E2E8F0'}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-800 text-sm">{task.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold uppercase tracking-widest">
                  {task.projectType} · {task.team || 'No team'}
                </p>
                {task.assignedTo && (
                  <p className="text-xs text-blue-600 mt-1 font-bold">
                    → {task.assignedTo.email?.split('@')[0]}
                  </p>
                )}
              </div>
              <span
                className="text-xs px-2 py-1 font-black uppercase tracking-widest flex-shrink-0"
                style={task.assignmentStatus === 'Active'
                  ? { background: '#ECFDF5', color: '#065F46' }
                  : { background: '#FEF2F2', color: '#991B1B' }
                }
              >
                {task.assignmentStatus}
              </span>
            </div>
            <div className="flex gap-2">
              <select
                value={selected[task._id] || ''}
                onChange={e => setSelected(prev => ({ ...prev, [task._id]: e.target.value }))}
                className="flex-1 border-2 border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 transition-colors"
              >
                <option value="">— Select member —</option>
                {getCompatibleMembers(task).map(m => (
                  <option key={m._id} value={m._id}>
                    {m.email?.split('@')[0]} ({m.team})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAssign(task._id)}
                disabled={loading || !selected[task._id]}
                className="px-4 py-2 text-white text-xs font-black disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              >
                Assign
              </button>
              {task.assignedTo && (
                <button
                  onClick={() => handleCancel(task._id)}
                  disabled={loading}
                  className="px-4 py-2 border-2 border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 disabled:opacity-40 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
