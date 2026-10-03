import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CourseDetails() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')

  const fetchCourse = () => api.course.details(courseId).then(res => setCourse(Array.isArray(res.data) ? res.data[0] : res.data)).finally(() => setLoading(false))
  useEffect(() => { fetchCourse().catch(err => { setMessage(err.message); setLoading(false) }) }, [courseId])

  const average = useMemo(() => {
    const ratings = course?.ratingAndReviews || []
    if (!ratings.length) return 0
    return ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratings.length
  }, [course])

  const enrolled = !!user && course?.studentsEnrolled?.some(item => (item?._id || item) === user._id)

  async function buyCourse() {
    if (!user) return navigate('/login', { state: { from: `/courses/${courseId}` } })
    if (user.accountType !== 'Student') return setMessage('Only student accounts can purchase a course.')
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!key) return setMessage('Add your public Razorpay key ID to VITE_RAZORPAY_KEY_ID in the frontend .env file before testing payments.')
    setBusy(true); setMessage('')
    try {
      const order = await api.payment.capture(courseId)
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Razorpay checkout could not be loaded.')
      const checkout = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'LearnSpace',
        description: order.courseName,
        image: order.thumbnail,
        order_id: order.orderId,
        prefill: { name: `${user.firstName || ''} ${user.lastName || ''}`.trim(), email: user.email },
        theme: { color: '#111827' },
        handler: () => setMessage('Payment completed. Your backend webhook will finish course enrollment.'),
      })
      checkout.open()
    } catch (err) { setMessage(err.message) } finally { setBusy(false) }
  }

  async function submitReview(e) {
    e.preventDefault(); setBusy(true); setMessage('')
    try {
      await api.course.rate({ rating: Number(rating), review, courseId })
      setReview(''); setMessage('Review added successfully.'); await fetchCourse()
    } catch (err) { setMessage(err.message) } finally { setBusy(false) }
  }

  if (loading) return <section className="section container"><Spinner /></section>
  if (!course) return <section className="section container"><div className="alert error">{message || 'Course not found.'}</div></section>

  return <>
    <section className="course-hero"><div className="container course-detail-grid"><div><Link className="back-link" to="/courses">← Back to courses</Link><span className="pill">{course.category?.name || 'Course'}</span><h1>{course.courseName}</h1><p>{course.courseDescription}</p><div className="detail-meta"><span>★ {average.toFixed(1)} ({course.ratingAndReviews?.length || 0})</span><span>{course.studentsEnrolled?.length || 0} students</span><span>By {course.instructor?.firstName} {course.instructor?.lastName}</span></div></div><aside className="purchase-card panel">{course.thumbnail && <img src={course.thumbnail} alt={course.courseName} />}<h2>₹{Number(course.price || 0).toLocaleString('en-IN')}</h2>{enrolled ? <Link className="btn btn-primary full" to="/dashboard/enrolled">Go to my courses</Link> : <button className="btn btn-primary full" disabled={busy} onClick={buyCourse}>{busy ? 'Please wait...' : 'Enroll now'}</button>}<small>Secure checkout powered by Razorpay.</small></aside></div></section>
    <section className="section container detail-body"><div><div className="panel content-block"><h2>What you'll learn</h2><p>{course.whatYouWillLearn || 'Course learning outcomes will appear here.'}</p></div><div className="panel content-block"><h2>Course content</h2>{course.courseContent?.length ? course.courseContent.map((section, index) => <details className="lesson-section" key={section._id} open={index === 0}><summary><strong>{section.sectionName}</strong><span>{section.subSection?.length || 0} lesson(s)</span></summary>{section.subSection?.map(lesson => <div className="lesson-row" key={lesson._id}><div><strong>{lesson.title}</strong><p>{lesson.description}</p></div><span>{lesson.timeDuration ? `${Math.round(Number(lesson.timeDuration))}s` : ''}</span></div>)}</details>) : <p className="muted">No sections have been added yet.</p>}</div>{user?.accountType === 'Student' && enrolled && <form className="panel content-block" onSubmit={submitReview}><h2>Rate this course</h2><div className="form-grid two"><label>Rating<select value={rating} onChange={e => setRating(e.target.value)}>{[5,4,3,2,1].map(v => <option key={v} value={v}>{v} star{v > 1 ? 's' : ''}</option>)}</select></label><label>Review<textarea value={review} onChange={e => setReview(e.target.value)} required placeholder="What did you think?" /></label></div><button className="btn btn-primary" disabled={busy}>Submit review</button></form>}</div><aside className="panel instructor-card"><span className="eyebrow">Instructor</span><div className="instructor"><img src={course.instructor?.image} alt="" /><div><strong>{course.instructor?.firstName} {course.instructor?.lastName}</strong><span>{course.instructor?.email}</span></div></div><p className="muted">{course.instructor?.additionalDetails?.about || 'Instructor profile information.'}</p>{course.instructions?.length > 0 && <><h3>Requirements</h3><ul>{course.instructions.map((item, i) => <li key={i}>{item}</li>)}</ul></>}</aside></section>
    {message && <div className="toast-message">{message}</div>}
  </>
}
