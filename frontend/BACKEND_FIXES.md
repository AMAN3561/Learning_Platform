# Backend fixes recommended before production

These were found while mapping the supplied backend APIs to the frontend.

## 1. Category course field typo

In `controllers/Course.js`:

```js
$push: {
  course: newCourse._id,
}
```

should be:

```js
$push: {
  courses: newCourse._id,
}
```

because `models/Category.js` defines `courses`.

## 2. Average rating GET request

`getAverageRating` currently reads `req.body.courseId` on a GET route. Prefer either:

```js
router.get('/getAverageRating/:courseId', getAverageRating)
```

and:

```js
const { courseId } = req.params
```

or use `req.query.courseId`.

## 3. Section deletion route mismatch

The controller expects:

```js
req.params.sectionId
```

but the route is:

```js
router.post('/deleteSection', ...)
```

Make the route include `/:sectionId`, or change the controller to read `req.body.sectionId`.

## 4. Razorpay webhook secret

Do not keep:

```js
const webhookSecret = '12345678'
```

Use:

```js
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
```

and configure the same secret in the Razorpay dashboard.

## 5. Production CORS

The backend currently only allows:

```js
origin: 'http://localhost:3000'
```

Use the deployed frontend URL in production, ideally through an environment variable.

## 6. Signup approval logic

The current code initializes `approved` to an empty string and then compares `approved === 'Instructor'`. It likely meant to check `accountType`:

```js
const approved = accountType !== 'Instructor'
```

## 7. Sensitive files

Keep `.env`, `node_modules`, and `.git` out of project ZIPs sent to other people. Your Git `.gitignore` should continue to include `.env` and `node_modules/`.
