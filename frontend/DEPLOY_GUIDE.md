# 🚀 FlowDesk — Deployment Guide

## Step 1: Backend Ko Render Pe Deploy Karo (FREE)

### render.com pe jao (free Node.js hosting)

1. **github.com pe project push karo:**
```bash
cd "E:\interview project"
git init
git add .
git commit -m "feat: complete workflow engine with SLA, RBAC, audit trails"
git remote add origin https://github.com/TERA-USERNAME/flowdesk-backend.git
git push -u origin main
```

2. **render.com pe:**
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables add karo:
     ```
     MONGO_URI = mongodb://avneeshkaur92_db_user:...
     JWT_SECRET = your_secret_key
     PORT = 5000
     ```
   - Deploy karo → URL milegi jaise: `https://flowdesk-backend.onrender.com`

---

## Step 2: Frontend mein Backend URL Update Karo

`index.html` mein line 4 dhundo:
```js
const API_BASE = 'http://localhost:5000/api';
```
**Replace karo with:**
```js
const API_BASE = 'https://flowdesk-backend.onrender.com/api';
```

---

## Step 3: Backend mein CORS Fix Karo

`src/app.js` mein:
```js
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://flowdesk-frontend.vercel.app'],
  credentials: true
}));
```

---

## Step 4: Frontend Ko Vercel Pe Deploy Karo

```bash
# vercel CLI install karo
npm install -g vercel

# frontend folder mein jao
cd frontend

# deploy
vercel

# follow prompts:
# Project name: flowdesk
# Framework: Other
# Public directory: .
```

Live URL milegi: `https://flowdesk.vercel.app`

---

## Resume Mein Kaise Likhna Hai:

```
FlowDesk — Enterprise Workflow Management System
Live: https://flowdesk.vercel.app | GitHub: github.com/username/flowdesk

• Built a configurable 3-level approval workflow engine (Employee → Manager → HR → Admin)
  with state machine, SLA tracking (48hr deadlines), and auto-escalation via cron jobs

• Implemented complete audit trail with IP logging, timestamps, and per-request action history
  using MongoDB Atlas aggregation pipelines

• Engineered role-based access control (RBAC) middleware for 4 roles with JWT authentication,
  bcrypt password hashing, and protected routes

• Built full-stack application: Node.js/Express REST API + vanilla JS dashboard deployed on
  Render + Vercel with real-time analytics and responsive UI

Tech Stack: Node.js, Express.js, MongoDB Atlas, JWT, bcrypt, Nodemon, Vercel, Render
```

---

## Demo Credentials (Interview Ke Liye):
| Role     | Email              | Password |
|----------|--------------------|----------|
| Employee | employee@test.com  | 123456   |
| Manager  | manager@test.com   | 123456   |
| HR       | hr@test.com        | 123456   |
| Admin    | admin@test.com     | 123456   |
