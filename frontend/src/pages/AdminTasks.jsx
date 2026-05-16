import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Plus, UserPlus, Users, SlidersHorizontal, Radio } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'
import AssignTaskModal from '../components/AssignTaskModal'
import AddMemberModal from '../components/AddMemberModal'
import TaskDetailModal from '../components/TaskDetailModal'

const INITIAL_FILTERS = { priority: '', team: '', project: '', status: '', search: '' }
const POLL_INTERVAL = 5000

export default function AdminTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [showCreate, setShowCreate] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filtersRef.current).filter(([, v]) => v))
      const res = await api.get('/tasks', { params })
      setTasks(prev => {
        const prevIds = JSON.stringify(prev.map(t => t._id + t.status + t.assignedTo?._id))
        const nextIds = JSON.stringify(res.data.map(t => t._id + t.status + t.assignedTo?._id))
        if (prevIds !== nextIds && prev.length > 0) {
          setLastUpdated(new Date())
        }
        return res.data
      })
    } catch {
      if (!silent) toast.error('Failed to load tasks')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { fetchTasks() }, [filters, fetchTasks])

  // Real-time polling
  useEffect(() => {
    const timer = setInterval(() => fetchTasks(true), POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchTasks])

  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleTaskUpdated = updated => {
    setTasks(prev => prev.map(t => t._id === updated._id ? updated : t))
    if (selectedTask?._id === updated._id) setSelectedTask(updated)
    setLastUpdated(new Date())
  }

  const selectStyle = "border-2 border-indigo-100 bg-white px-3 py-2 text-sm text-slate-700 font-semibold focus:border-blue-500 transition-colors"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} className="w-1 h-8" />
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tasks</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-slate-500">{tasks.length} total</span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                  <span className="live-dot w-1.5 h-1.5 bg-emerald-500 inline-block" />
                  LIVE
                </span>
                {lastUpdated && (
                  <span className="text-xs text-slate-400">
                    · updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors">
            <UserPlus size={14} /> Add Member
          </button>
          <button onClick={() => setShowAssign(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-2 border-violet-300 text-violet-700 hover:bg-violet-50 transition-colors">
            <Users size={14} /> Assign Task
          </button>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-black text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Plus size={14} /> Create Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E0E7FF' }} className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={13} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <select name="priority" value={filters.priority} onChange={handleFilterChange} className={selectStyle}>
            <option value="">All Priorities</option>
            {['High', 'Medium', 'Low'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select name="project" value={filters.project} onChange={handleFilterChange} className={selectStyle}>
            <option value="">All Projects</option>
            {['STEM', 'NON_STEM', 'TECHNICAL'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className={selectStyle}>
            <option value="">All Statuses</option>
            {['To Do', 'In Progress', 'Done', 'Overdue'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <input name="search" value={filters.search} onChange={handleFilterChange}
            placeholder="Search tasks..."
            className="border-2 border-indigo-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 transition-colors flex-1 min-w-44" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse" style={{ background: '#FFFFFF', border: '1px solid #E0E7FF', borderLeft: '4px solid #E0E7FF' }} />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center" style={{ background: '#FFFFFF', border: '1px solid #E0E7FF' }}>
          <div className="w-16 h-16 flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Plus size={28} className="text-white" />
          </div>
          <p className="text-slate-800 font-black text-xl">No tasks yet</p>
          <p className="text-slate-400 text-sm mt-2 mb-6">Create your first task to get started</p>
          <button onClick={() => setShowCreate(true)}
            className="px-6 py-3 text-white text-sm font-black"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            Create Task
          </button>
        </div>
      )}

      <CreateTaskModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={task => { setTasks(prev => [task, ...prev]); setLastUpdated(new Date()) }} />
      <AssignTaskModal open={showAssign} onClose={() => setShowAssign(false)} onUpdated={handleTaskUpdated} />
      <AddMemberModal open={showAddMember} onClose={() => setShowAddMember(false)} onCreated={() => {}} />
      <TaskDetailModal task={selectedTask} open={!!selectedTask} onClose={() => setSelectedTask(null)} onUpdated={handleTaskUpdated} />
    </div>
  )
}
