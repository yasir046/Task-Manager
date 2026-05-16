import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import TasksByTeamCharts from '../components/charts/TasksByTeamCharts'
import TasksByStatusBar from '../components/charts/TasksByStatusBar'
import TasksPerUser from '../components/charts/TasksPerUser'
import OverdueTasksPie from '../components/charts/OverdueTasksPie'

export default function Dashboard() {
  const [byTeam, setByTeam] = useState([])
  const [byStatus, setByStatus] = useState([])
  const [perUser, setPerUser] = useState([])
  const [overdue, setOverdue] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/tasks-by-team'),
      api.get('/dashboard/tasks-by-status'),
      api.get('/dashboard/tasks-per-user'),
      api.get('/dashboard/overdue-by-team')
    ])
      .then(([t, s, u, o]) => {
        setByTeam(Array.isArray(t.data) ? t.data : []);
        setByStatus(Array.isArray(s.data) ? s.data : []);
        setPerUser(Array.isArray(u.data) ? u.data : []);
        setOverdue(Array.isArray(o.data) ? o.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-transparent animate-spin"
        style={{ borderTopColor: '#065F46', borderRightColor: '#4ADE80' }} />
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-4 px-6 py-4" style={{ background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
        <div style={{ background: 'linear-gradient(135deg, #065F46, #059669)' }} className="w-1 h-8" />
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#064E3B' }}>Dashboard</h1>
          <p className="text-sm" style={{ color: '#059669' }}>Analytics & team overview</p>
        </div>
      </div>
      <TasksByTeamCharts data={byTeam} />
      <TasksByStatusBar data={byStatus} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TasksPerUser data={perUser} />
        <OverdueTasksPie data={overdue} />
      </div>
    </div>
  )
}
