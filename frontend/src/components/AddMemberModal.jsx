import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../api/axios'
import { PROJECT_TEAMS } from '../utils/helpers'

const INITIAL = { email: '', password: '', project: '', team: '' }

export default function AddMemberModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)

  const teams = form.project ? PROJECT_TEAMS[form.project] || [] : []

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'project' ? { team: '' } : {}) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Email and password are required')
    setLoading(true)
    try {
      const res = await api.post('/users', form)
      toast.success('Member added!')
      onCreated(res.data)
      setForm(INITIAL)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-500 transition-colors"
  const labelClass = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest"

  return (
    <Modal open={open} onClose={() => { setForm(INITIAL); onClose() }} title="Add Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email / Gmail</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="member@example.com" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="••••••••" required className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Project Type</label>
            <select name="project" value={form.project} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              {['STEM', 'NON_STEM', 'TECHNICAL'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Team</label>
            <select name="team" value={form.team} onChange={handleChange} disabled={!form.project}
              className={`${inputClass} disabled:opacity-50`}>
              <option value="">Select</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => { setForm(INITIAL); onClose() }}
            className="flex-1 py-2.5 border-2 border-slate-200 text-slate-600 text-sm font-bold hover:border-slate-400 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 text-white text-sm font-black disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
