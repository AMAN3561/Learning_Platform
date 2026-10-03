import { useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import EmptyState from '../components/EmptyState'
import Spinner from '../components/Spinner'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { api.profile.enrolled().then(res => setCourses(res.data || [])).catch(err => setError(err.message)).finally(() => setLoading(false)) }, [])
  return <div className="dashboard-page"><div className="page-heading compact"><span className="eyebrow">Learning</span><h1>Enrolled courses</h1></div>{loading && <Spinner />}{error && <div className="alert error">{error}</div>}{!loading && !error && (courses.length ? <div className="course-grid dashboard-courses">{courses.map(c => <CourseCard key={c._id} course={c} />)}</div> : <EmptyState title="No enrolled courses yet" text="Explore the catalog and enroll in your first course." action={<Link className="btn btn-primary" to="/courses">Explore courses</Link>} />)}</div>
}
