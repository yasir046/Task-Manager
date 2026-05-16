import React, { useState, useEffect } from 'react'
import { Download, Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../api/axios'
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers'

export default function TaskDetailModal({ task, open, onClose, onUpdated }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (task) setStatus(task.status) }, [task])

  if (!task) return null

  const handleStatusUpdate = async newStatus => {
    setLoading(true)
    try {
      const res = await api.patch(`/tasks/${task._id}/status`, { status: newStatus })
      setStatus(newStatus)
      toast.success('Status updated!')
      onUpdated(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const token = localStorage.getItem('etharaToken')

  const statusConfig = {
    'To Do':      { bg: '#EFF9FF', text: '#0369A1', border: '#38BDF8', active: '#38BDF8' },
    'In Progress':{ bg: '#F5F3FF', text: '#6D28D9', border: '#7C3AED', active: '#7C3AED' },
    'Done':       { bg: '#F0FDF4', text: '#166534', border: '#4ADE80', active: '#4ADE80' },
    'Overdue':    { bg: '#FFF7ED', text: '#C2410C', border: '#FB923C', active: '#FB923C' },
  }

  return (
    <Modal open={open} onClose={onClose} title={task.title} wide>
      <div className="space-y-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {task.projectType && (
            <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 font-black uppercase tracking-widest border border-indigo-100">
              {task.projectType}
            </span>
          )}
          {task.priority && (
            <span className={`text-xs px-3 py-1 font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          )}
          {(() => {
            const sc = statusConfig[status] || statusConfig['To Do']
            return (
              <span className="text-xs px-3 py-1 font-black uppercase tracking-widest border"
                style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                {status}
              </span>
            )
          })()}
        </div>

        {task.description && (
          <div className="border-l-4 px-4 py-3" style={{ borderColor: '#38BDF8', background: '#F0F9FF' }}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Team', value: task.team || '—' },
            { label: 'Assigned To', value: task.assignedTo ? task.assignedTo.email?.split('@')[0] : 'Unassigned' },
            { label: 'Due Date', value: formatDate(task.dueDate) },
            { label: 'Due Time', value: task.dueTime || '—' },
            { label: 'Assignment', value: task.assignmentStatus },
            { label: 'Created By', value: task.createdBy?.email?.split('@')[0] || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="px-3 py-2.5" style={{ background: '#FFFFFF', border: '1px solid #E0E7FF' }}>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        {task.files?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Paperclip size={13} className="text-slate-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attachments ({task.files.length})</p>
            </div>
            <div className="space-y-1.5">
              {task.files.map((f, i) => (
                <a key={i} href={`${baseUrl}/files/${f.filename}?token=${token}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm px-4 py-2.5 hover:border-sky-400 hover:bg-sky-50 transition-colors group"
                  style={{ background: '#FFFFFF', border: '1px solid #E0E7FF' }}>
                  <Download size={13} className="text-slate-400 group-hover:text-sky-600 transition-colors" />
                  <span className="flex-1 truncate text-slate-700 font-medium group-hover:text-sky-700">{f.originalName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Status update buttons */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Update Status</p>
          <div className="flex gap-2">
            {['To Do', 'In Progress', 'Done'].map(s => {
              const sc = statusConfig[s]
              const active = status === s
              return (
                <button key={s} onClick={() => handleStatusUpdate(s)} disabled={loading || active}
                  className="flex-1 py-2.5 text-xs font-black border-2 transition-all disabled:cursor-default"
                  style={active
                    ? { background: sc.active, color: 'white', borderColor: sc.active }
                    : { background: '#FFFFFF', color: '#64748B', borderColor: '#E0E7FF' }
                  }>
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}
