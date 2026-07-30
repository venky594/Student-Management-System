# Student Management System (MERN)

A full-stack prototype: MongoDB + Express + React (Vite) + Node.

## Features
- JWT auth (admin / teacher roles)
- Student CRUD with search, filtering, pagination
- Course management
- Attendance tracking (per date, per student)
- Results/marks with auto-computed letter grade
- Role-based permissions (only admins can delete students/courses)

## Folder structure
```
student-management-system/
  backend/     Express API + Mongoose models
  frontend/    React (Vite) client
```

## 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a free MongoDB Atlas cluster

## 2. Backend setup
```bash
cd backend
cp .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET, etc.)
npm install
npm run seed     # creates admin user + 3 sample courses
npm run dev       # starts on http://localhost:5000
```
Seeded login: `admin@school.com` / `admin123`

## 3. Frontend setup
Open a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:5173
```

Open http://localhost:5173, log in with the seeded admin, add a course (if you skipped seeding), then add students.

## 4. API overview
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | - | Create user |
| POST | /api/auth/login | - | Login, returns JWT |
| GET | /api/students?search=&page=&limit= | Bearer | List/search/paginate |
| POST | /api/students | Bearer | Create student |
| PUT | /api/students/:id | Bearer | Update student |
| DELETE | /api/students/:id | Admin | Delete student |
| GET/POST | /api/courses | Bearer / Admin | List / create course |
| POST | /api/attendance | Bearer | Mark attendance (upsert) |
| GET | /api/attendance/student/:id | Bearer | Attendance history |
| POST | /api/results | Bearer | Add a result (auto grade) |
| GET | /api/results/student/:id | Bearer | Student's results |

## 5. What to extend first
1. **Attendance & Results UI** — the backend is fully built (models, routes, controllers) but the frontend only has Students and Courses pages. Add a student detail page with tabs for Attendance and Results — highest-value next step since the API already supports it.
2. **File uploads** — student photos / ID cards (use `multer` + local disk or S3).
3. **Dashboard** — counts by course/status, attendance % this month, a simple chart (recharts).
4. **Bulk import** — CSV upload of students (papaparse on frontend or `csv-parse` on backend).
5. **Refresh tokens** — current JWT expires in 7 days with no refresh flow; add refresh tokens for a production app.
6. **Validation library** — swap manual checks for `zod` or `joi` on the backend, and `react-hook-form` on the frontend for cleaner form state.
7. **Deployment** — backend to Render/Railway, frontend to Vercel/Netlify, DB to MongoDB Atlas; update CORS `CLIENT_URL` and `VITE_API_URL` accordingly.
