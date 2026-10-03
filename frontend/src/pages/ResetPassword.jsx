import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function ResetPassword() {
  const { token } = useParams(); const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { await api.auth.resetPassword({ ...form, token }); navigate('/login') } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <section className="auth-section"><div className="auth-card panel"><span className="eyebrow">New password</span><h1>Choose a new password</h1>{error && <div className="alert error">{error}</div>}<form className="stack-form" onSubmit={submit}><label>New password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label><label>Confirm password<input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required /></label><button className="btn btn-primary full" disabled={busy}>Update password</button></form><p className="auth-foot"><Link to="/login">Back to login</Link></p></div></section>
}
