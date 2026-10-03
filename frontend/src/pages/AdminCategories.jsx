import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState([]); const [form, setForm] = useState({ name: '', description: '' }); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  const load = () => api.course.categories().then(res => setCategories(res.data || []))
  useEffect(() => { load().catch(err => setError(err.message)) }, [])
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const res = await api.admin.createCategory(form); setMessage(res.message); setForm({ name: '', description: '' }); await load() } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Admin</span><h1>Course categories</h1></div>{message && <div className="alert success">{message}</div>}{error && <div className="alert error">{error}</div>}<div className="builder-grid"><form className="panel content-block stack-form" onSubmit={submit}><h2>Create category</h2><label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label><label>Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><button className="btn btn-primary" disabled={busy}>Create category</button></form><div className="panel content-block"><h2>Existing categories</h2><div className="category-list">{categories.map(c => <div key={c._id}><strong>{c.name}</strong><p>{c.description || 'No description'}</p></div>)}</div></div></div></div>
}
