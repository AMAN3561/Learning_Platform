import { Link } from 'react-router-dom'
export default function NotFound() { return <section className="auth-section"><div className="auth-card panel center"><span className="eyebrow">404</span><h1>Page not found</h1><p className="muted">The page you're looking for doesn't exist.</p><Link className="btn btn-primary" to="/">Go home</Link></div></section> }
