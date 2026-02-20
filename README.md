# FlowDesk — Workflow Management System

A backend system I built to understand how real approval workflows work in companies. Most tutorials teach basic CRUD — this project has actual state machine logic, SLA tracking, and audit trails.

## What it does

Employee submits a request (leave, expense, WFH, overtime) → it goes through 3 levels of approval:

```
Employee → Manager (L1) → HR (L2) → Admin (L3) → Approved
```

Each level has a 48hr deadline. If nobody approves in time, the request auto-escalates. Every action is logged with IP address and timestamp.

## Tech Stack

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication + bcrypt
- Frontend: HTML, CSS, Vanilla JS

## Features

- 3-level approval state machine
- SLA tracking with auto-escalation (cron job)
- Complete audit trail (IP + timestamp per action)
- Role-based access control — 4 roles, middleware protected
- Dashboard analytics for HR/Admin

## Run locally

```bash
git clone https://github.com/avneeshkaur/flowdesk.git
cd flowdesk
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/requests/submit        → Employee only
GET    /api/requests/my            → Employee
GET    /api/requests/              → Manager, HR, Admin
PATCH  /api/requests/:id/action    → Manager, HR, Admin
GET    /api/requests/dashboard/stats → HR, Admin only
```

## Test credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@test.com | 123456 |
| Manager | manager@test.com | 123456 |
| HR | hr@test.com | 123456 |
| Admin | admin@test.com | 123456 |

## Project Structure

```
src/
├── controllers/     # auth + request logic
├── middleware/      # JWT auth + role check
├── models/          # User + Request schemas
├── routes/          # API routes
├── services/        # Escalation cron job
├── app.js
└── server.js
frontend/
└── index.html       # Dashboard UI
```

---

Built by [Avneesh Kaur](https://github.com/avneeshkaur) — [LinkedIn](https://linkedin.com/in/avneeshkaur-dev)
