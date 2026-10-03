import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const res = await api.auth.requestReset(email); setMessage(res.message) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <section className="auth-section"><div className="auth-card panel"><span className="eyebrow">Password recovery</span><h1>Reset your password</h1><p className="muted">Enter the email linked to your account.</p>{message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}<form className="stack-form" onSubmit={submit}><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><button className="btn btn-primary full" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button></form><p className="auth-foot"><Link to="/login">← Back to login</Link></p></div></section>
}
