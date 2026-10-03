# LearnSpace Frontend

A complete React frontend built for the supplied Node.js / Express / MongoDB learning-platform backend.

## Included

- Responsive landing page and course catalog
- Course details, sections, lessons, instructor details, ratings and reviews
- Student signup with email OTP, login, forgot/reset password
- JWT authentication using the token returned by the backend
- Student dashboard, profile editing, avatar upload, enrolled courses, password change and account deletion
- Student ratings/reviews
- Razorpay checkout initiation
- Instructor course creation, thumbnail upload, section creation and video lesson upload
- Instructor course list and content builder
- Admin category creation
- Role-protected routes for Student, Instructor and Admin

## Run it

Your backend currently allows CORS from `http://localhost:3000`, so this Vite project is intentionally configured to run on port **3000**.

```bash
cd Learning_Platform_frontend
npm install
cp .env.example .env
npm run dev
```

Run the backend separately on port 4000:

```bash
cd Server
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Frontend environment variables

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_RAZORPAY_KEY_ID=your_public_razorpay_key_id
```

`VITE_RAZORPAY_KEY_ID` is a **public key ID**. Never put `RAZORPAY_SECRET`, JWT secrets, MongoDB credentials, Cloudinary secrets or email passwords in the frontend.

## Backend APIs used

### Auth
- `POST /api/v1/auth/sendotp`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/changepassword`
- `POST /api/v1/auth/reset-password-token`
- `POST /api/v1/auth/reset-password`

### Profile
- `GET /api/v1/profile/getUserDetails`
- `PUT /api/v1/profile/updateProfile`
- `PUT /api/v1/profile/updateDisplayPicture`
- `GET /api/v1/profile/getEnrolledCourses`
- `DELETE /api/v1/profile/deleteProfile`

### Courses
- `GET /api/v1/course/getAllCourses`
- `POST /api/v1/course/getCourseDetails`
- `GET /api/v1/course/showAllCategories`
- `POST /api/v1/course/createCourse`
- `POST /api/v1/course/addSection`
- `POST /api/v1/course/addSubSection`
- `POST /api/v1/course/createRating`
- `GET /api/v1/course/getReviews`
- `POST /api/v1/course/createCategory`

### Payment
- `POST /api/v1/payment/capturePayment`

## Important backend notes

The supplied backend has a few issues that are independent of the frontend:

1. In `controllers/Course.js`, category update uses `$push: { course: newCourse._id }` but the Category schema field is `courses`. Change it to `$push: { courses: newCourse._id }` if you want category pages to contain newly created courses.
2. `GET /course/getAverageRating` reads `req.body.courseId`. GET requests should normally use a query parameter or route parameter. This frontend calculates the displayed average from the populated reviews instead.
3. `deleteSection` reads `req.params.sectionId`, while the route is currently `POST /deleteSection` without `/:sectionId`. The frontend therefore does not expose section deletion.
4. Razorpay `/verifySignature` is written like a webhook endpoint. Configure it as a Razorpay webhook and move the hardcoded webhook secret into an environment variable before production use.
5. The backend CORS origin is hardcoded to `http://localhost:3000`. Change it when you deploy the frontend.

## Security

Do not commit either backend or frontend `.env` files. The uploaded backend archive contained a `.env` file; rotate any real secrets if that archive has been shared anywhere you do not fully trust.
