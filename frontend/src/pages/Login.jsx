import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try { await login(form.email, form.password); navigate(location.state?.from || '/dashboard') }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return <section className="auth-section"><div className="auth-card panel"><span className="eyebrow">Welcome back</span><h1>Log in to LearnSpace</h1><p className="muted">Continue your learning journey.</p>{error && <div className="alert error">{error}</div>}<form onSubmit={submit} className="stack-form"><label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" /></label><label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" /></label><div className="form-row"><span /><Link to="/forgot-password">Forgot password?</Link></div><button className="btn btn-primary full btn-lg" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button></form><p className="auth-foot">New here? <Link to="/signup">Create an account</Link></p></div></section>
}
