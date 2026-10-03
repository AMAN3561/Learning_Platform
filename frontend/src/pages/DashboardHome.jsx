import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardHome() {
  const { user } = useAuth()
  const role = user?.accountType
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Dashboard</span><h1>Welcome, {user?.firstName}</h1><p className="muted">Manage your learning account and continue where you left off.</p></div><div className="stats-grid"><div className="stat-card panel"><span>Account</span><strong>{role}</strong><small>Your current role</small></div><div className="stat-card panel"><span>Profile</span><strong>{user?.additionalDetails ? 'Ready' : 'Basic'}</strong><small>Keep your details current</small></div><div className="stat-card panel"><span>Courses</span><strong>{user?.courses?.length || 0}</strong><small>Connected to your account</small></div></div><div className="panel quick-panel"><h2>Quick actions</h2><div className="quick-actions"><Link className="btn btn-primary" to="/courses">Browse courses</Link><Link className="btn btn-secondary" to="/dashboard/profile">Edit profile</Link>{role === 'Instructor' && <Link className="btn btn-secondary" to="/dashboard/create-course">Create course</Link>}{role === 'Student' && <Link className="btn btn-secondary" to="/dashboard/enrolled">My learning</Link>}</div></div></div>
}
