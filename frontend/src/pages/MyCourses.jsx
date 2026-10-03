import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function MyCourses() {
  const { user } = useAuth(); const [courses, setCourses] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { api.course.all().then(res => setCourses((res.data || []).filter(c => (c.instructor?._id || c.instructor) === user._id))).catch(err => setError(err.message)).finally(() => setLoading(false)) }, [user._id])
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Instructor</span><h1>My courses</h1></div>{loading && <Spinner />}{error && <div className="alert error">{error}</div>}{!loading && !error && (courses.length ? <div className="table-list panel">{courses.map(c => <div className="course-row" key={c._id}>{c.thumbnail ? <img src={c.thumbnail} alt="" /> : <div className="row-placeholder" />}<div><strong>{c.courseName}</strong><span>₹{Number(c.price || 0).toLocaleString('en-IN')} · {c.studentsEnrolled?.length || 0} students</span></div><Link className="btn btn-secondary" to={`/dashboard/course-builder/${c._id}`}>Manage content</Link></div>)}</div> : <EmptyState title="No courses yet" text="Create your first course to get started." action={<Link className="btn btn-primary" to="/dashboard/create-course">Create course</Link>} />)}</div>
}
