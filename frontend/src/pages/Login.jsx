import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { PROJECT_TEAMS } from '../utils/helpers'

const PROJECT_OPTIONS = Object.keys(PROJECT_TEAMS)

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activeDemo, setActiveDemo] = useState('')

  // Signup state
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', project: '', team: '' })
  const [showSignupPass, setShowSignupPass] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState('')

  const teamOptions = PROJECT_TEAMS[signupForm.project] || []

  const fillDemo = role => {
    setLoginError('')
    setActiveDemo(role)
    setLoginForm(
      role === 'admin'
        ? { email: 'admin@ethara.com', password: 'password123' }
        : { email: 'member@ethara.com', password: 'password123' }
    )
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await api.post('/auth/login', loginForm)
      login(res.data.token, res.data.user)
      toast.success('Signed in successfully')
      navigate(res.data.user.role === 'admin' ? '/dashboard' : '/tasks', { replace: true })
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSignup = async e => {
    e.preventDefault()
    setSignupError('')
    if (signupForm.password !== signupForm.confirmPassword) {
      return setSignupError('Passwords do not match')
    }
    if (!signupForm.project) return setSignupError('Please select a project')
    if (!signupForm.team) return setSignupError('Please select a team')
    setSignupLoading(true)
    try {
      const res = await api.post('/auth/register', {
        email: signupForm.email,
        password: signupForm.password,
        project: signupForm.project,
        team: signupForm.team
      })
      login(res.data.token, res.data.user)
      toast.success('Account created! Welcome to Ethara.')
      navigate('/tasks', { replace: true })
    } catch (err) {
      setSignupError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSignupLoading(false)
    }
  }

  const leftPanel = (
    <div
      className="hidden lg:flex flex-col justify-between w-2/5 p-12"
      style={{ background: 'linear-gradient(160deg, #052e16 0%, #064E3B 60%, #065F46 100%)' }}
    >
      <div>
        <div className="flex items-center gap-3 mb-16">
          <div style={{ background: 'linear-gradient(135deg, #4ADE80, #059669)' }}
            className="w-9 h-9 flex items-center justify-center">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="text-white font-black text-lg tracking-widest uppercase">Ethara</span>
        </div>
        <h1 className="text-4xl font-black text-white leading-tight mb-4">
          Task Management<br />
          <span style={{
            WebkitTextFillColor: 'transparent',
            background: 'linear-gradient(135deg, #4ADE80, #86EFAC)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text'
          }}>
            Reimagined.
          </span>
        </h1>
        <p className="text-white/40 text-sm leading-relaxed max-w-xs">
          Assign, track, and manage your team's work with clarity and precision.
        </p>
      </div>
      <div className="space-y-4">
        {[
          { color: '#4ADE80', label: 'Light Green', desc: 'Background & accents' },
          { color: '#064E3B', label: 'Dark Green', desc: 'Sidebar & panels' },
          { color: '#2563EB', label: 'Blue', desc: 'Primary actions' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-2 h-8" style={{ background: item.color }} />
            <div>
              <p className="text-white/80 text-xs font-bold">{item.label}</p>
              <p className="text-white/30 text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#ECFDF5' }}>
      {leftPanel}

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div style={{ background: 'linear-gradient(135deg, #4ADE80, #059669)' }}
              className="w-8 h-8 flex items-center justify-center">
              <span className="text-white font-black text-xs">E</span>
            </div>
            <span className="font-black text-slate-800 tracking-widest uppercase">Ethara</span>
          </div>

          {/* Tab switcher */}
          <div className="flex border-2 border-slate-200 mb-8" style={{ background: '#FFFFFF' }}>
            <button
              onClick={() => { setTab('login'); setLoginError(''); setSignupError('') }}
              className="flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all"
              style={tab === 'login'
                ? { background: 'linear-gradient(135deg, #065F46, #059669)', color: 'white' }
                : { background: 'transparent', color: '#64748B' }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setLoginError(''); setSignupError('') }}
              className="flex-1 py-3 text-sm font-black uppercase tracking-widest transition-all"
              style={tab === 'signup'
                ? { background: 'linear-gradient(135deg, #065F46, #059669)', color: 'white' }
                : { background: 'transparent', color: '#64748B' }}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => fillDemo('admin')}
                  className={`py-2.5 text-sm font-bold border-2 transition-all ${
                    activeDemo === 'admin'
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                      : 'border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
                  }`}>
                  Login as Admin
                </button>
                <button onClick={() => fillDemo('member')}
                  className={`py-2.5 text-sm font-bold border-2 transition-all ${
                    activeDemo === 'member'
                      ? 'border-green-600 text-green-700 bg-green-50'
                      : 'border-slate-200 text-slate-600 hover:border-green-400 hover:text-green-700'
                  }`}>
                  Login as Member
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or enter manually</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {loginError && (
                <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 text-sm px-4 py-3 mb-4 flex items-center justify-between">
                  <span>{loginError}</span>
                  <button onClick={() => setLoginError('')} className="ml-2 font-bold text-lg leading-none">&times;</button>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Email</label>
                  <input type="email" value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" required
                    className="w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input type={showLoginPass ? 'text' : 'password'} value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••" required
                      className="w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 transition-colors pr-11" />
                    <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showLoginPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loginLoading}
                  className="w-full py-3.5 text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-opacity"
                  style={{ background: loginLoading ? '#94A3B8' : 'linear-gradient(135deg, #065F46 0%, #059669 100%)' }}>
                  {loginLoading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Don't have an account?{' '}
                <button onClick={() => setTab('signup')} className="text-emerald-600 font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            </>
          )}

          {/* SIGNUP FORM */}
          {tab === 'signup' && (
            <>
              <p className="text-sm text-slate-500 mb-6">Create a member account to get started.</p>

              {signupError && (
                <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 text-sm px-4 py-3 mb-4 flex items-center justify-between">
                  <span>{signupError}</span>
                  <button onClick={() => setSignupError('')} className="ml-2 font-bold text-lg leading-none">&times;</button>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Email</label>
                  <input type="email" value={signupForm.email}
                    onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" required
                    className="w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Project</label>
                    <select value={signupForm.project}
                      onChange={e => setSignupForm(p => ({ ...p, project: e.target.value, team: '' }))}
                      required
                      className="w-full border-2 border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-emerald-500 transition-colors">
                      <option value="">Select...</option>
                      {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Team</label>
                    <select value={signupForm.team}
                      onChange={e => setSignupForm(p => ({ ...p, team: e.target.value }))}
                      required disabled={!signupForm.project}
                      className="w-full border-2 border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-emerald-500 transition-colors disabled:opacity-50">
                      <option value="">Select...</option>
                      {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input type={showSignupPass ? 'text' : 'password'} value={signupForm.password}
                      onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min. 6 characters" required minLength={6}
                      className="w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 transition-colors pr-11" />
                    <button type="button" onClick={() => setShowSignupPass(!showSignupPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showSignupPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-widest">Confirm Password</label>
                  <input type="password" value={signupForm.confirmPassword}
                    onChange={e => setSignupForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="••••••••" required
                    className="w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 transition-colors" />
                </div>

                <button type="submit" disabled={signupLoading}
                  className="w-full py-3.5 text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 mt-2 disabled:opacity-50 transition-opacity"
                  style={{ background: signupLoading ? '#94A3B8' : 'linear-gradient(135deg, #065F46 0%, #059669 100%)' }}>
                  {signupLoading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-emerald-600 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
