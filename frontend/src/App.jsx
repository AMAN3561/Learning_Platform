import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import DashboardHome from './pages/DashboardHome'
import Profile from './pages/Profile'
import EnrolledCourses from './pages/EnrolledCourses'
import Settings from './pages/Settings'
import CreateCourse from './pages/CreateCourse'
import CourseBuilder from './pages/CourseBuilder'
import MyCourses from './pages/MyCourses'
import AdminCategories from './pages/AdminCategories'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="enrolled" element={<ProtectedRoute roles={['Student']}><EnrolledCourses /></ProtectedRoute>} />
          <Route path="create-course" element={<ProtectedRoute roles={['Instructor']}><CreateCourse /></ProtectedRoute>} />
          <Route path="course-builder/:courseId" element={<ProtectedRoute roles={['Instructor']}><CourseBuilder /></ProtectedRoute>} />
          <Route path="my-courses" element={<ProtectedRoute roles={['Instructor']}><MyCourses /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute roles={['Admin']}><AdminCategories /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
