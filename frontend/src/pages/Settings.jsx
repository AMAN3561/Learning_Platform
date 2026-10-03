import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const { logout } = useAuth(); const navigate = useNavigate()
  async function change(e) { e.preventDefault(); setBusy(true); setError(''); try { const res = await api.auth.changePassword(form); setMessage(res.message); setForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' }) } catch (err) { setError(err.message) } finally { setBusy(false) } }
  async function removeAccount() { if (!window.confirm('Delete your account permanently? This cannot be undone.')) return; setBusy(true); try { await api.profile.remove(); logout(); navigate('/') } catch (err) { setError(err.message); setBusy(false) } }
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Settings</span><h1>Account settings</h1></div>{message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}<form className="panel content-block stack-form" onSubmit={change}><h2>Change password</h2><label>Current password<input type="password" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} required /></label><div className="form-grid two"><label>New password<input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required /></label><label>Confirm new password<input type="password" value={form.confirmNewPassword} onChange={e => setForm({ ...form, confirmNewPassword: e.target.value })} required /></label></div><button className="btn btn-primary" disabled={busy}>Update password</button></form><div className="panel danger-zone"><div><h2>Delete account</h2><p className="muted">Permanently delete your account and associated profile.</p></div><button className="btn btn-danger" disabled={busy} onClick={removeAccount}>Delete account</button></div></div>
}
