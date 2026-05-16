import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#FB923C', '#7C3AED', '#38BDF8', '#4ADE80', '#F472B6', '#0891B2']

export default function OverdueTasksPie({ data }) {
  const chartData = data.map(d => ({ name: d._id || 'Unknown', value: d.count }))

  return (
    <div className="p-6" style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderTop: '3px solid #FB923C' }}>
      <div className="flex items-center gap-3 mb-4">
        <div style={{ background: 'linear-gradient(135deg, #FB923C, #065F46)' }} className="w-1 h-6" />
        <h2 className="text-lg font-black tracking-tight" style={{ color: '#064E3B' }}>Overdue Tasks</h2>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={95} dataKey="value"
              label={({ name, value }) => `${name}: ${value}`} labelLine strokeWidth={0}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ border: '1px solid #A7F3D0', fontSize: 12, fontWeight: 700, background: '#F0FDF6' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed" style={{ borderColor: '#A7F3D0' }}>
          <div className="w-14 h-14 flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #4ADE80, #065F46)' }}>
            <span className="text-white font-black text-xl">✓</span>
          </div>
          <p className="font-black" style={{ color: '#064E3B' }}>No overdue tasks!</p>
          <p className="text-sm mt-1" style={{ color: '#6EE7B7' }}>Great job staying on track</p>
        </div>
      )}
    </div>
  )
}
