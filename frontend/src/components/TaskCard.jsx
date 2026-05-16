import React from 'react'
import { Paperclip, User, Calendar } from 'lucide-react'
import { formatDate, getPriorityColor, getStatusColor, getPriorityBorderColor } from '../utils/helpers'

export default function TaskCard({ task, onClick }) {
  const accentColor = getPriorityBorderColor(task.priority)

  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E0E7FF',
        borderLeft: `4px solid ${accentColor}`
      }}
    >
      {/* Hover top bar */}
      <div
        className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
      />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-sm leading-snug flex-1">{task.title}</h3>
          {task.files?.length > 0 && (
            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
              <Paperclip size={12} />
              <span className="text-xs font-bold">{task.files.length}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wide border border-indigo-100">
            {task.projectType}
          </span>
          <span className={`text-xs px-2 py-0.5 font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-0.5 font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {task.team && (
          <p className="text-xs text-slate-500 font-medium">
            <span className="text-slate-400">Team /</span> {task.team}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div
              className="w-5 h-5 flex items-center justify-center"
              style={{ background: task.assignedTo ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : '#E2E8F0' }}
            >
              <User size={10} className={task.assignedTo ? 'text-white' : 'text-slate-400'} />
            </div>
            <span className="font-medium">
              {task.assignedTo ? task.assignedTo.email?.split('@')[0] : 'Unassigned'}
            </span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
