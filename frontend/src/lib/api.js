const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

function getStoredToken() {
  return localStorage.getItem('lp_token')
}

export async function apiRequest(path, options = {}) {
  const token = getStoredToken()
  const isFormData = options.body instanceof FormData
  const headers = new Headers(options.headers || {})

  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = { success: response.ok, message: response.statusText }
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(data?.message || data?.error || 'Something went wrong')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  auth: {
    login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    signup: (payload) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    sendOtp: (email) => apiRequest('/auth/sendotp', { method: 'POST', body: JSON.stringify({ email }) }),
    changePassword: (payload) => apiRequest('/auth/changepassword', { method: 'POST', body: JSON.stringify(payload) }),
    requestReset: (email) => apiRequest('/auth/reset-password-token', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (payload) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  },
  profile: {
    get: () => apiRequest('/profile/getUserDetails'),
    update: (payload) => apiRequest('/profile/updateProfile', { method: 'PUT', body: JSON.stringify(payload) }),
    enrolled: () => apiRequest('/profile/getEnrolledCourses'),
    updatePicture: (file) => {
      const form = new FormData()
      form.append('displayPicture', file)
      return apiRequest('/profile/updateDisplayPicture', { method: 'PUT', body: form })
    },
    remove: () => apiRequest('/profile/deleteProfile', { method: 'DELETE' }),
  },
  course: {
    all: () => apiRequest('/course/getAllCourses'),
    details: (courseId) => apiRequest('/course/getCourseDetails', { method: 'POST', body: JSON.stringify({ courseId }) }),
    categories: () => apiRequest('/course/showAllCategories'),
    categoryDetails: (categoryId) => apiRequest('/course/getCategoryPageDetails', { method: 'POST', body: JSON.stringify({ categoryId }) }),
    reviews: () => apiRequest('/course/getReviews'),
    rate: (payload) => apiRequest('/course/createRating', { method: 'POST', body: JSON.stringify(payload) }),
    create: (formData) => apiRequest('/course/createCourse', { method: 'POST', body: formData }),
    addSection: (payload) => apiRequest('/course/addSection', { method: 'POST', body: JSON.stringify(payload) }),
    addSubSection: (formData) => apiRequest('/course/addSubSection', { method: 'POST', body: formData }),
  },
  payment: {
    capture: (courseId) => apiRequest('/payment/capturePayment', { method: 'POST', body: JSON.stringify({ course_id: courseId }) }),
  },
  admin: {
    createCategory: (payload) => apiRequest('/course/createCategory', { method: 'POST', body: JSON.stringify(payload) }),
  },
}

export { API_BASE }
