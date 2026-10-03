import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import Spinner from '../components/Spinner'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'

const topics = ['Web Development', 'DSA', 'System Design', 'Backend', 'Cloud', 'Databases', 'Career Skills']

export default function Home() {
  const [courses, setCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([api.course.all(), api.course.reviews()]).then(([courseResult, reviewResult]) => {
      if (courseResult.status === 'fulfilled') setCourses(courseResult.value.data || [])
      if (reviewResult.status === 'fulfilled') setReviews(reviewResult.value.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <>
      <section className="hero premium-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="container hero-grid">
          <Reveal className="hero-copy-wrap">
            <div className="hero-kicker"><span className="pulse-dot" /> Learn without the clutter</div>
            <h1>Turn curiosity into <span className="gradient-text">career-ready skill.</span></h1>
            <p className="hero-copy">A focused learning experience for discovering practical courses, following clear lesson paths, and keeping your progress in one beautiful workspace.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to="/courses">Explore courses <span>→</span></Link>
              <Link className="btn btn-secondary btn-lg" to="/signup">Create free account</Link>
            </div>
            <div className="trust-row">
              <div><strong>{courses.length || '—'}</strong><span>Live courses</span></div>
              <div className="trust-divider" />
              <div><strong>{reviews.length || '—'}</strong><span>Learner reviews</span></div>
              <div className="trust-divider" />
              <div><strong>3</strong><span>Role workspaces</span></div>
            </div>
          </Reveal>

          <Reveal className="hero-visual-wrap" delay={120}>
            <div className="hero-dashboard-card glass-card">
              <div className="hero-card-top">
                <div><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /></div>
                <span className="live-chip"><span className="pulse-dot" /> Live learning</span>
              </div>
              <div className="hero-preview-title"><span>Today’s focus</span><strong>Backend foundations</strong></div>
              <div className="learning-line"><span style={{ width: '74%' }} /></div>
              <div className="hero-preview-grid">
                <div><small>Progress</small><strong>74%</strong><span>+8% this week</span></div>
                <div><small>Lessons</small><strong>18 / 24</strong><span>6 remaining</span></div>
              </div>
              <div className="next-lesson">
                <div className="next-lesson-icon">▶</div>
                <div><small>Up next</small><strong>JWT authentication flow</strong></div>
                <span>18 min</span>
              </div>
            </div>
            <div className="floating-badge badge-top"><span>✦</span><div><small>Structured paths</small><strong>Learn in order</strong></div></div>
            <div className="floating-badge badge-bottom"><span>✓</span><div><small>Project ready</small><strong>Practical skills</strong></div></div>
          </Reveal>
        </div>

        <div className="container topic-strip-wrap">
          <div className="topic-strip" aria-label="Popular learning topics">
            {topics.map(topic => <span key={topic}>{topic}</span>)}
          </div>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="section-head">
            <div><span className="eyebrow">Featured learning</span><h2>Courses worth opening next</h2><p className="section-subtitle">Fresh content from your live course catalog.</p></div>
            <Link className="text-link" to="/courses">View all courses <span>→</span></Link>
          </div>
        </Reveal>
        {loading ? <Spinner /> : (
          <div className="course-grid">
            {courses.slice(0, 6).map((course, index) => (
              <Reveal key={course._id} delay={index * 60}><CourseCard course={course} /></Reveal>
            ))}
          </div>
        )}
        {!loading && courses.length === 0 && <div className="empty-showcase panel">Your course catalog is ready for its first course.</div>}
      </section>

      <section className="section experience-section">
        <div className="container">
          <Reveal>
            <div className="section-head centered-head"><div><span className="eyebrow">Designed for momentum</span><h2>Everything important. Nothing distracting.</h2><p className="section-subtitle">A learning UI that keeps the next action obvious from the first login to the final lesson.</p></div></div>
          </Reveal>
          <div className="bento-grid">
            <Reveal className="bento-card bento-large" delay={40}>
              <div className="bento-icon">01</div><span className="eyebrow">Focused dashboard</span><h3>Your learning, organized by role.</h3><p>Students, instructors, and admins see only the tools that matter to their workflow.</p>
              <div className="mini-dashboard"><div className="mini-side"><span /><span /><span /></div><div className="mini-main"><div /><div className="mini-cards"><span /><span /><span /></div></div></div>
            </Reveal>
            <Reveal className="bento-card" delay={90}>
              <div className="bento-icon">02</div><h3>Built-in dark mode</h3><p>Switch themes instantly and keep your preference across visits.</p><div className="theme-demo"><span className="theme-sun">☀</span><span className="theme-moon">☾</span></div>
            </Reveal>
            <Reveal className="bento-card" delay={140}>
              <div className="bento-icon">03</div><h3>Clear course journeys</h3><p>Browse, inspect, enroll, and continue learning without losing context.</p><div className="journey-dots"><span className="active" /><i /><span className="active" /><i /><span /></div>
            </Reveal>
            <Reveal className="bento-card bento-wide" delay={180}>
              <div><div className="bento-icon">04</div><h3>Polished on every screen</h3><p>Responsive layouts, mobile navigation, subtle motion, and accessible reduced-motion support are built in.</p></div>
              <div className="device-stack"><div className="device desktop-device"><span /></div><div className="device phone-device"><span /></div></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section container how-section">
        <Reveal><div className="section-head"><div><span className="eyebrow">Simple by design</span><h2>From signup to skill in three steps</h2></div></div></Reveal>
        <div className="steps-grid">
          {[['01','Find the right course','Search the live catalog and open a course to review its outline, instructor, rating, and price.'],['02','Learn with structure','Follow sections and lessons in a clear order while your account keeps your learning workspace organized.'],['03','Build and progress','Apply what you learn, leave feedback, and move into your next course with less friction.']].map(([num,title,copy], index) => (
            <Reveal className="step-card" key={num} delay={index * 80}><span className="step-number">{num}</span><h3>{title}</h3><p>{copy}</p></Reveal>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section reviews-section">
          <div className="container">
            <Reveal><div className="section-head"><div><span className="eyebrow">Learner feedback</span><h2>What people say after learning</h2></div></div></Reveal>
            <div className="review-grid">
              {reviews.slice(0, 3).map((review, index) => (
                <Reveal key={review._id} delay={index * 80}>
                  <article className="review-card panel">
                    <div className="review-quote">“</div>
                    <div className="stars">{'★'.repeat(Math.max(1, Math.min(5, review.rating || 0)))}</div>
                    <p>“{review.review}”</p>
                    <div className="review-user">
                      {review.user?.image ? <img src={review.user.image} alt="" /> : <span className="avatar-fallback">{review.user?.firstName?.[0] || 'L'}</span>}
                      <div><strong>{review.user?.firstName} {review.user?.lastName}</strong><span>{review.course?.courseName}</span></div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section container">
        <Reveal>
          <div className="final-cta">
            <div><span className="eyebrow">Start now</span><h2>Your next skill can begin today.</h2><p>Open the catalog, choose one useful thing, and make progress on it.</p></div>
            <div className="final-cta-actions"><Link className="btn btn-primary btn-lg" to="/courses">Explore courses <span>→</span></Link><Link className="btn btn-secondary btn-lg" to="/signup">Create account</Link></div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
