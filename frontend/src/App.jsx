import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminTasks from './pages/AdminTasks'
import MemberTasks from './pages/MemberTasks'
import Layout from './components/Layout'

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-main-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-soft-olive border-t-transparent" />
    </div>
  )
}

function RequireAuth({ children, adminOnly }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/tasks" replace />
  return children
}

function TasksRoute() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminTasks /> : <MemberTasks />
}

function LoginRoute() {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (user) return <Navigate to={user.role === 'admin' ? '/dashboard' : '/tasks'} replace />
  return <Login />
}

function CatchAll() {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return <Navigate to={user ? (user.role === 'admin' ? '/dashboard' : '/tasks') : '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/dashboard" element={
        <RequireAuth adminOnly>
          <Layout><Dashboard /></Layout>
        </RequireAuth>
      } />
      <Route path="/tasks" element={
        <RequireAuth>
          <Layout><TasksRoute /></Layout>
        </RequireAuth>
      } />
      <Route path="*" element={<CatchAll />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#8DBA88', color: '#fff', borderRadius: '12px', fontSize: '14px' },
          error: { style: { background: '#D46A6A', color: '#fff' } },
          duration: 3000
        }}
      />
    </AuthProvider>
  )
}
