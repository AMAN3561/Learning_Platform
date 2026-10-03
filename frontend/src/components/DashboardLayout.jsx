import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const { user } = useAuth()
  const role = user?.accountType

  const item = (to, label, icon, end = false) => (
    <NavLink to={to} end={end}><span className="sidebar-icon">{icon}</span><span>{label}</span></NavLink>
  )

  return (
    <section className="dashboard-shell container">
      <aside className="sidebar panel">
        <div className="user-mini">
          {user?.image ? <img src={user.image} alt="" /> : <span className="user-mini-fallback">{user?.firstName?.[0] || 'U'}</span>}
          <div><strong>{user?.firstName} {user?.lastName}</strong><span>{role}</span></div>
        </div>
        <div className="sidebar-label">Workspace</div>
        {item('/dashboard', 'Overview', '⌂', true)}
        {item('/dashboard/profile', 'My profile', '◎')}
        {role === 'Student' && item('/dashboard/enrolled', 'Enrolled courses', '▷')}
        {role === 'Instructor' && item('/dashboard/create-course', 'Create course', '+')}
        {role === 'Instructor' && item('/dashboard/my-courses', 'My courses', '▤')}
        {role === 'Admin' && item('/dashboard/categories', 'Categories', '◇')}
        <div className="sidebar-label">Preferences</div>
        {item('/dashboard/settings', 'Settings', '⚙')}
      </aside>
      <div className="dashboard-content"><Outlet /></div>
    </section>
  )
}
