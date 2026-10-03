import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import ScrollEnhancements from './ScrollEnhancements'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  const signOut = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <ScrollEnhancements />
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label="LearnSpace home">
            <span className="brand-mark"><span>LS</span></span>
            <span>LearnSpace</span>
          </Link>

          <nav className={`nav-links ${menuOpen ? 'mobile-open' : ''}`} aria-label="Primary navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </nav>

          <div className="nav-actions">
            <ThemeToggle />
            {user ? (
              <>
                <Link className="nav-user-chip" to="/dashboard/profile" title="Open profile">
                  {user?.image ? <img src={user.image} alt="" /> : <span>{user?.firstName?.[0] || 'U'}</span>}
                  <strong>{user?.firstName || 'Account'}</strong>
                </Link>
                <button className="btn btn-primary nav-desktop-action" onClick={signOut}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost nav-desktop-action" to="/login">Log in</Link>
                <Link className="btn btn-primary nav-desktop-action" to="/signup">Get started <span>↗</span></Link>
              </>
            )}
            <button
              className="icon-btn menu-toggle"
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-nav-panel container">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button type="button" onClick={signOut}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/signup">Create account</NavLink>
              </>
            )}
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="container footer-top">
          <div>
            <span className="eyebrow">Keep learning</span>
            <h2>Build skills that stay useful.</h2>
          </div>
          <Link className="btn btn-primary btn-lg" to="/courses">Browse the catalog <span>→</span></Link>
        </div>
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand"><span className="brand-mark"><span>LS</span></span><span>LearnSpace</span></Link>
            <p className="muted">A focused learning platform for discovering courses, tracking progress, and building real-world skills.</p>
          </div>
          <div><strong>Explore</strong><Link to="/courses">All courses</Link><Link to="/signup">Create account</Link><Link to="/login">Log in</Link></div>
          <div><strong>Workspace</strong><Link to="/dashboard">Dashboard</Link><Link to="/dashboard/profile">Profile</Link><Link to="/dashboard/settings">Settings</Link></div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} LearnSpace</span><span>Designed for focused learning.</span></div>
      </footer>
    </div>
  )
}
