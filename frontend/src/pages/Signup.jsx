import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const initial = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', accountType: 'Student', contactNumber: '', otp: '' }

export default function Signup() {
  const [form, setForm] = useState(initial)
  const [otpSent, setOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function sendOtp() {
    if (!form.email) return setError('Enter your email first.')
    setBusy(true); setError(''); setMessage('')
    try { await api.auth.sendOtp(form.email); setOtpSent(true); setMessage('OTP sent to your email.') }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try { await api.auth.signup(form); navigate('/login', { state: { created: true } }) }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return <section className="auth-section"><div className="auth-card panel wide"><span className="eyebrow">Create account</span><h1>Start learning today</h1><p className="muted">Choose Student to learn or Instructor to create courses.</p>{error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}<form onSubmit={submit} className="stack-form"><div className="form-grid two"><label>First name<input name="firstName" value={form.firstName} onChange={update} required /></label><label>Last name<input name="lastName" value={form.lastName} onChange={update} required /></label></div><label>Email<div className="input-action"><input name="email" type="email" value={form.email} onChange={update} required /><button type="button" className="btn btn-secondary" onClick={sendOtp} disabled={busy}>{otpSent ? 'Resend OTP' : 'Send OTP'}</button></div></label>{otpSent && <label>OTP<input name="otp" value={form.otp} onChange={update} required maxLength="6" placeholder="6-digit code" /></label>}<div className="form-grid two"><label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label><label>Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} required /></label></div><div className="form-grid two"><label>Account type<select name="accountType" value={form.accountType} onChange={update}><option>Student</option><option>Instructor</option></select></label><label>Contact number<input name="contactNumber" value={form.contactNumber} onChange={update} inputMode="tel" /></label></div><button className="btn btn-primary full btn-lg" disabled={!otpSent || busy}>{busy ? 'Creating account...' : 'Create account'}</button></form><p className="auth-foot">Already have an account? <Link to="/login">Log in</Link></p></div></section>
}
