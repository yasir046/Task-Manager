import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import TaskCard from '../components/TaskCard'
import TaskDetailModal from '../components/TaskDetailModal'
import { useAuth } from '../context/AuthContext'

const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low']
const POLL_INTERVAL = 5000

export default function MemberTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [priority, setPriority] = useState('All')
  const [selectedTask, setSelectedTask] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [newAssignment, setNewAssignment] = useState(false)

  const fetchTasks = useCallback(async (silent = false) => {
    try {
      const res = await api.get('/tasks')
      setTasks(prev => {
        const prevIds = JSON.stringify(prev.map(t => t._id + t.status))
        const nextIds = JSON.stringify(res.data.map(t => t._id + t.status))
        if (prevIds !== nextIds && prev.length > 0) {
          setLastUpdated(new Date())
          if (res.data.length > prev.length) {
            setNewAssignment(true)
            toast('New task assigned!', { icon: '📋', style: { background: '#2563EB', color: '#fff' } })
            setTimeout(() => setNewAssignment(false), 4000)
          }
        }
        return res.data
      })
    } catch {
      if (!silent) toast.error('Failed to load tasks')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Real-time polling
  useEffect(() => {
    const timer = setInterval(() => fetchTasks(true), POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchTasks])

  const filtered = priority === 'All' ? tasks : tasks.filter(t => t.priority === priority)

  const handleTaskUpdated = updated => {
    setTasks(prev => prev.map(t => t._id === updated._id ? updated : t))
    if (selectedTask?._id === updated._id) setSelectedTask(updated)
    setLastUpdated(new Date())
  }

  const priorityFilterColors = {
    High: { active: '#FB923C', border: '#FED7AA' },
    Medium: { active: '#38BDF8', border: '#BAE6FD' },
    Low: { active: '#4ADE80', border: '#BBF7D0' },
  }

  return (
    <div className="space-y-5">
      {/* Assignment banner */}
      <div
        className="p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D0F2B 0%, #1A1040 60%, #0D1F5C 100%)' }}
      >
        {newAssignment && (
          <div className="absolute top-3 right-3 px-3 py-1 text-xs font-black text-white animate-bounce"
            style={{ background: '#38BDF8' }}>
            NEW TASK!
          </div>
        )}
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Your Assignment</p>
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Project</p>
            <span className="text-xs font-black px-3 py-1.5 uppercase tracking-widest"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #7C3AED)', color: 'white' }}>
              {user?.project || '—'}
            </span>
          </div>
          <div className="w-px h-10 opacity-20 bg-white" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Team</p>
            <p className="text-3xl font-black text-white tracking-tight">{user?.team || '—'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Tasks</p>
            <p className="text-3xl font-black text-white">{filtered.length}</p>
          </div>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-3">
          <span className="live-dot w-2 h-2 bg-emerald-400 inline-block" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live — syncing every 5s</span>
          {lastUpdated && (
            <span className="text-white/30 text-xs ml-2">· last change {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {/* Priority filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPriority('All')}
          className="px-4 py-2 text-sm font-bold border-2 transition-all"
          style={priority === 'All'
            ? { background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: 'white', borderColor: 'transparent' }
            : { background: '#FFFFFF', color: '#64748B', borderColor: '#E0E7FF' }
          }>
          All Tasks
        </button>
        {PRIORITY_FILTERS.filter(p => p !== 'All').map(p => (
          <button key={p} onClick={() => setPriority(p)}
            className="px-4 py-2 text-sm font-bold border-2 transition-all"
            style={priority === p
              ? { background: priorityFilterColors[p].active, color: 'white', borderColor: priorityFilterColors[p].active }
              : { background: '#FFFFFF', color: '#64748B', borderColor: '#E0E7FF' }
            }>
            {p} Priority
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse" style={{ background: '#FFFFFF', border: '1px solid #E0E7FF', borderLeft: '4px solid #E0E7FF' }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(task => (
            <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center"
          style={{ background: '#FFFFFF', border: '1px solid #E0E7FF' }}>
          <div className="w-16 h-16 flex items-center justify-center mb-5 border-2 border-indigo-100"
            style={{ background: '#FFFFFF' }}>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-slate-800 font-black text-xl">No tasks assigned</p>
          <p className="text-slate-400 text-sm mt-2">
            {priority !== 'All' ? `No ${priority.toLowerCase()} priority tasks` : 'Waiting for assignments...'}
          </p>
        </div>
      )}

      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdated={handleTaskUpdated}
      />
    </div>
  )
}
