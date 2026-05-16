import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, File } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../api/axios'
import { PROJECT_TEAMS } from '../utils/helpers'

const INITIAL = { title: '', description: '', projectType: '', team: '', dueDate: '', dueTime: '', priority: 'Medium' }

export default function CreateTaskModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(accepted => setFiles(prev => [...prev, ...accepted]), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [], 'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'image/*': [], 'application/zip': [], 'application/x-zip-compressed': []
    },
    maxSize: 10 * 1024 * 1024
  })

  const teams = form.projectType ? PROJECT_TEAMS[form.projectType] || [] : []

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'projectType' ? { team: '' } : {}) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Task title is required')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      files.forEach(f => fd.append('files', f))
      const res = await api.post('/tasks', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Task created!')
      onCreated(res.data)
      setForm(INITIAL)
      setFiles([])
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-500 transition-colors"
  const labelClass = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest"

  const priorityConfig = {
    High: { active: '#DC2626', label: 'High' },
    Medium: { active: '#D97706', label: 'Medium' },
    Low: { active: '#059669', label: 'Low' },
  }

  return (
    <Modal open={open} onClose={() => { setForm(INITIAL); setFiles([]); onClose() }} title="Create Task" wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Task Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Enter task title" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Task description..." className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Project Type</label>
            <select name="projectType" value={form.projectType} onChange={handleChange} className={inputClass}>
              <option value="">Select project</option>
              {['STEM', 'NON_STEM', 'TECHNICAL'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Team</label>
            <select name="team" value={form.team} onChange={handleChange} disabled={!form.projectType} className={`${inputClass} disabled:opacity-50`}>
              <option value="">Select team</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Due Time</label>
            <input type="time" name="dueTime" value={form.dueTime} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Priority</label>
            <div className="flex gap-2">
              {Object.entries(priorityConfig).map(([p, cfg]) => (
                <button
                  type="button" key={p}
                  onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                  className="flex-1 py-2.5 text-sm font-bold border-2 transition-all"
                  style={form.priority === p
                    ? { background: cfg.active, color: 'white', borderColor: cfg.active }
                    : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }
                  }
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className={labelClass}>Attachments</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={20} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 font-medium">
              {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, Images, ZIP · Max 10MB</p>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2">
                  <File size={13} className="text-slate-400 flex-shrink-0" />
                  <span className="flex-1 truncate text-sm text-slate-700 font-medium">{f.name}</span>
                  <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)}KB</span>
                  <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-600 transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => { setForm(INITIAL); setFiles([]); onClose() }}
            className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 text-sm font-bold hover:border-slate-400 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 text-white text-sm font-black disabled:opacity-50 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
