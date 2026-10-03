import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  const instructor = course?.instructor
  const instructorName = instructor ? `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() : 'Instructor'
  const reviews = course?.ratingAndReviews || []
  const rating = reviews.length
    ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length
    : 0

  return (
    <Link className="course-card" to={`/courses/${course._id}`}>
      <div className="course-thumb-wrap">
        {course.thumbnail ? <img className="course-thumb" src={course.thumbnail} alt={course.courseName} /> : <div className="course-thumb placeholder">Course</div>}
        <div className="course-thumb-overlay" />
        <span className="course-chip">{course.category?.name || 'Course'}</span>
      </div>
      <div className="course-card-body">
        <div className="course-card-title-row">
          <h3>{course.courseName || 'Untitled course'}</h3>
          <span className="course-arrow">↗</span>
        </div>
        <p className="course-instructor">By {instructorName}</p>
        <div className="course-card-rating">
          <span className="stars">★</span>
          <strong>{rating ? rating.toFixed(1) : 'New'}</strong>
          <span>{reviews.length ? `(${reviews.length})` : 'No reviews yet'}</span>
        </div>
        <div className="course-meta">
          <strong>₹{Number(course.price || 0).toLocaleString('en-IN')}</strong>
          <span>{course.studentsEnrolled?.length || 0} learner{course.studentsEnrolled?.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </Link>
  )
}
