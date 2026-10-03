import { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [details, setDetails] = useState(null)
  const [form, setForm] = useState({ dateOfBirth: '', about: '', contactNumber: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { api.profile.get().then(res => { setDetails(res.data); const p = res.data.additionalDetails || {}; setForm({ dateOfBirth: p.dateOfBirth || '', about: p.about || '', contactNumber: p.contactNumber || '' }) }).catch(err => setError(err.message)) }, [])
  async function save(e) { e.preventDefault(); setBusy(true); setError(''); try { await api.profile.update(form); await refreshUser(); setMessage('Profile updated successfully.') } catch (err) { setError(err.message) } finally { setBusy(false) } }
  async function upload(e) { const file = e.target.files?.[0]; if (!file) return; setBusy(true); setError(''); try { await api.profile.updatePicture(file); await refreshUser(); setMessage('Profile picture updated.') } catch (err) { setError(err.message) } finally { setBusy(false) } }
  if (!details && !error) return <Spinner />
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Profile</span><h1>My profile</h1></div>{error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}<div className="panel profile-header"><img src={user?.image || details?.image} alt="Profile" /><div><h2>{details?.firstName} {details?.lastName}</h2><p>{details?.email}</p><label className="btn btn-secondary file-btn">Change picture<input type="file" accept="image/*" onChange={upload} hidden /></label></div></div><form className="panel content-block stack-form" onSubmit={save}><h2>Personal details</h2><div className="form-grid two"><label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></label><label>Contact number<input value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} inputMode="tel" /></label></div><label>About<textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} placeholder="Tell learners a little about yourself..." /></label><button className="btn btn-primary" disabled={busy}>Save changes</button></form></div>
}
