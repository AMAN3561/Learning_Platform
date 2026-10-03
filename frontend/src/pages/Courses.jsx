import { useEffect, useMemo, useState } from 'react'
import CourseCard from '../components/CourseCard'
import Spinner from '../components/Spinner'
import Reveal from '../components/Reveal'
import { api } from '../lib/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.allSettled([api.course.all(), api.course.categories()]).then(([coursesResult, categoriesResult]) => {
      if (coursesResult.status === 'fulfilled') setCourses(coursesResult.value.data || [])
      else setError(coursesResult.reason?.message || 'Could not load courses.')
      if (categoriesResult.status === 'fulfilled') setCategories(categoriesResult.value.data || [])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let result = courses.filter(course => {
      const haystack = `${course.courseName || ''} ${course.courseDescription || ''} ${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.toLowerCase()
      const matchesSearch = haystack.includes(search.toLowerCase())
      const courseCategory = course.category?._id || course.category
      const matchesCategory = category === 'all' || courseCategory === category
      return matchesSearch && matchesCategory
    })

    if (sort === 'price-low') result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    if (sort === 'price-high') result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    if (sort === 'popular') result = [...result].sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
    return result
  }, [courses, search, category, sort])

  return (
    <section className="catalog-page">
      <div className="catalog-hero">
        <div className="container">
          <Reveal><span className="eyebrow">Course catalog</span><h1>Find something worth learning.</h1><p>Search practical courses, compare options, and choose the next skill you want to build.</p></Reveal>
        </div>
      </div>

      <div className="section container catalog-content">
        <Reveal>
          <div className="catalog-toolbar panel">
            <label className="search-field"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors..." /></label>
            <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="all">All categories</option>
              {categories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort courses">
              <option value="featured">Featured</option>
              <option value="popular">Most popular</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>
          <div className="catalog-result-row"><span>{filtered.length} course{filtered.length === 1 ? '' : 's'} found</span>{search && <button className="text-button" type="button" onClick={() => setSearch('')}>Clear search</button>}</div>
        </Reveal>

        {loading && <Spinner />}
        {error && <div className="alert error">{error}</div>}
        {!loading && !error && filtered.length > 0 && <div className="course-grid">{filtered.map((course, index) => <Reveal key={course._id} delay={Math.min(index, 8) * 45}><CourseCard course={course} /></Reveal>)}</div>}
        {!loading && !error && filtered.length === 0 && <div className="empty-showcase panel"><strong>No courses matched your filters.</strong><span>Try another search or category.</span></div>}
      </div>
    </section>
  )
}
