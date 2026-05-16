import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const PROJECT_COLORS = { STEM: '#38BDF8', NON_STEM: '#7C3AED', TECHNICAL: '#4ADE80' }

export default function TasksByTeamCharts({ data }) {
  const grouped = {}
  data.forEach(({ _id, count }) => {
    if (!_id.project || !_id.team) return
    if (!grouped[_id.project]) grouped[_id.project] = {}
    grouped[_id.project][_id.team] = count
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div style={{ background: 'linear-gradient(135deg, #065F46, #4ADE80)' }} className="w-1 h-6" />
        <h2 className="text-lg font-black tracking-tight" style={{ color: '#064E3B' }}>Tasks by Team</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['STEM', 'NON_STEM', 'TECHNICAL'].map(project => {
          const teamData = grouped[project] || {}
          const chartData = Object.entries(teamData).map(([team, count]) => ({ team, count }))
          const color = PROJECT_COLORS[project]
          return (
            <div key={project} className="p-5"
              style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderTop: `3px solid ${color}` }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2" style={{ background: color }} />
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: '#065F46' }}>
                  {project.replace('_', ' ')}
                </h3>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#D1FAE5" vertical={false} />
                    <XAxis dataKey="team" tick={{ fontSize: 10, fill: '#6EE7B7', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6EE7B7', fontWeight: 700 }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ border: '1px solid #A7F3D0', fontSize: 12, fontWeight: 700, background: '#F0FDF6' }} cursor={{ fill: '#D1FAE5' }} />
                    <Bar dataKey="count" fill={color} radius={[0, 0, 0, 0]} name="Tasks" maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-44 flex items-center justify-center border-2 border-dashed" style={{ borderColor: '#A7F3D0' }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6EE7B7' }}>No data</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
