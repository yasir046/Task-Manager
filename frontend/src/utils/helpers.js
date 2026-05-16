export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getPriorityColor(priority) {
  const map = {
    High: 'bg-orange-100 text-orange-700 border border-orange-200',
    Medium: 'bg-sky-100 text-sky-700 border border-sky-200',
    Low: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  }
  return map[priority] || 'bg-slate-100 text-slate-600'
}

export function getPriorityBorderColor(priority) {
  const map = {
    High: '#FB923C',
    Medium: '#38BDF8',
    Low: '#4ADE80'
  }
  return map[priority] || '#CBD5E1'
}

export function getStatusColor(status) {
  const map = {
    'To Do': 'bg-sky-50 text-sky-700 border border-sky-200',
    'In Progress': 'bg-violet-100 text-violet-700 border border-violet-200',
    'Done': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Overdue': 'bg-orange-100 text-orange-700 border border-orange-200'
  }
  return map[status] || 'bg-slate-100 text-slate-600'
}

export function getStatusAccentColor(status) {
  const map = {
    'To Do': '#38BDF8',
    'In Progress': '#7C3AED',
    'Done': '#4ADE80',
    'Overdue': '#FB923C'
  }
  return map[status] || '#CBD5E1'
}

export const PROJECT_TEAMS = {
  STEM: ['Valor', 'Vindex'],
  NON_STEM: ['Evals'],
  TECHNICAL: ['Fenrir', 'Kensei', 'Jaeger']
}
