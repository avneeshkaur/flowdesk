# 🔄 FlowDesk - Enterprise Workflow Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**A production-grade configurable workflow engine with multi-level approval matrix, SLA tracking, auto-escalation, and complete audit trails.**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [API Docs](#-api-documentation) • [Demo](#-demo)

</div>

---

## 🌟 Why FlowDesk?

Traditional leave management systems are basic CRUD apps. **FlowDesk** is different:

- ✅ **Not a Simple CRUD** - Complex state machine with 3-level approvals
- ✅ **SLA Compliance** - 48-hour deadlines with auto-escalation
- ✅ **Complete Audit Trail** - Every action logged with IP + timestamp
- ✅ **Production Patterns** - RBAC, JWT, background jobs, error handling
- ✅ **Scalable Design** - Configurable approval matrix for any workflow

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token generation
- Password hashing using bcrypt (10 salt rounds)
- Role-based access control (RBAC) with middleware
- Protected routes with Bearer token validation

### 📋 Multi-Level Approval Workflow
- **3-Level Approval Matrix**: Employee → Manager → HR → Admin
- **State Machine**: Dynamic status progression based on current level
- **Request Types**: Leave, Expense, WFH, Overtime
- **Flexible Permissions**: Each role has specific approval rights

### ⏱️ SLA Tracking & Auto-Escalation
- **48-Hour SLA** per approval level
- **Auto-Reset**: New deadline after each approval
- **Cron Job**: Runs every hour to check overdue requests
- **System Actions**: Auto-escalation logged in audit trail

### 📊 Complete Audit Trail
- **IP Address Logging** for every action
- **Timestamp Tracking** with millisecond precision
- **Action History**: Approve/Reject/Escalate with comments
- **Full Timeline**: Complete request journey visible

### 📈 Dashboard Analytics
- Total requests count
- Pending, Approved, Rejected breakdown
- Escalated requests tracking
- Role-based dashboard access (HR/Admin only)

---

## 🏗️ Architecture

### System Flow Diagram

```
┌─────────────┐
│  Employee   │
│  (Submit)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Request Submitted               │
│  Status: pending | Level: 1         │
│  SLA: Now + 48 hours                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐      Approved      ┌──────────────────────┐
│   Manager   │ ──────────────────▶│ Status: approved_by_  │
│ (Level 1)   │                     │ manager | Level: 2   │
└─────────────┘                     │ SLA: Reset +48hrs    │
       │                            └──────┬───────────────┘
       │ Rejected                          │
       ▼                                   ▼
┌─────────────┐                    ┌─────────────┐
│   Status:   │                    │     HR      │
│  rejected   │                    │  (Level 2)  │
└─────────────┘                    └──────┬──────┘
                                          │ Approved
                                          ▼
                                   ┌──────────────────────┐
                                   │ Status: approved_by_  │
                                   │ hr | Level: 3        │
                                   │ SLA: Reset +48hrs    │
                                   └──────┬───────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │    Admin    │
                                   │  (Level 3)  │
                                   └──────┬──────┘
                                          │ Approved
                                          ▼
                                   ┌─────────────┐
                                   │   Status:   │
                                   │  approved   │
                                   │   (FINAL)   │
                                   └─────────────┘

                 ┌──────────────────────────────────┐
                 │  SLA Escalation (Background)     │
                 │  If SLA > 48hrs → escalated      │
                 └──────────────────────────────────┘
```

### Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                    User Model                           │
├─────────────────────────────────────────────────────────┤
│ - name: String                                          │
│ - email: String (unique)                                │
│ - password: String (hashed)                             │
│ - role: enum [employee, manager, hr, admin]             │
│ - isActive: Boolean                                     │
│ - timestamps: createdAt, updatedAt                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Request Model                          │
├─────────────────────────────────────────────────────────┤
│ - title: String                                         │
│ - description: String                                   │
│ - type: enum [leave, expense, wfh, overtime]            │
│ - requestedBy: ObjectId → User                          │
│ - status: enum [pending, approved_by_manager,           │
│           approved_by_hr, approved, rejected,           │
│           escalated]                                    │
│ - currentLevel: Number (1-3)                            │
│ - slaDeadline: Date                                     │
│ - isEscalated: Boolean                                  │
│ - approvalMatrix: [                                     │
│     {                                                   │
│       level: Number,                                    │
│       role: String,                                     │
│       approvedBy: ObjectId → User,                      │
│       action: enum [approved, rejected, escalated],     │
│       comment: String,                                  │
│       actionAt: Date,                                   │
│       ipAddress: String                                 │
│     }                                                   │
│   ]                                                     │
│ - startDate, endDate: Date                              │
│ - timestamps: createdAt, updatedAt                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Runtime** | Node.js v18+ |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas |
| **ODM** | Mongoose |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Hashing** | bcryptjs |
| **Environment** | dotenv |
| **Dev Tools** | Nodemon |

---

## 📁 Project Structure

```
flowdesk/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js       # Registration & Login
│   │   └── request.controller.js    # CRUD + Approval logic
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── roleMiddleware.js        # RBAC enforcement
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   └── request.model.js         # Request schema with audit
│   ├── routes/
│   │   ├── auth.routes.js           # Auth endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   └── request.routes.js        # Request endpoints
│   ├── services/
│   │   └── escalation.service.js    # SLA monitoring cron
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server + DB connection
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
└── README.md                        # Documentation
```

---

## 🔧 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/avneeshkaur/flowdesk.git
cd flowdesk
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create `.env` file in root:
```env
PORT=5000
MONGO_URI=mongodb://user:password@shard1:27017,shard2:27017,shard3:27017/database?ssl=true&replicaSet=atlas-xxx&authSource=admin
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

### Step 4: Start Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

---

## 📡 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "employee"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Request Management

#### Submit Request
```http
POST /api/requests/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Annual Leave",
  "description": "Family vacation",
  "type": "leave",
  "startDate": "2026-03-01",
  "endDate": "2026-03-05"
}
```

#### Get My Requests
```http
GET /api/requests/my
Authorization: Bearer <token>
```

#### Approve/Reject Request
```http
PATCH /api/requests/:id/action
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approved",
  "comment": "Approved - enjoy your vacation!"
}
```

#### Dashboard Analytics
```http
GET /api/requests/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "dashboard": {
    "total": 150,
    "pending": 23,
    "approved": 110,
    "rejected": 12,
    "escalated": 5
  }
}
```

---

## 🔐 Role-Based Permissions

| Role | Submit Requests | View Own | View All | Approve L1 | Approve L2 | Approve L3 | Dashboard |
|------|----------------|----------|----------|-----------|-----------|-----------|-----------|
| **Employee** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **HR** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |

---

## 📊 Workflow Examples

### Example 1: Successful Approval Flow

```
1. Employee submits leave request
   → Status: pending, Level: 1, SLA: 2026-02-22 10:00

2. Manager approves (within 24 hours)
   → Status: approved_by_manager, Level: 2, SLA: 2026-02-24 09:30
   → Audit: Manager approved at 2026-02-21 09:30 from IP 192.168.1.10

3. HR approves (within 48 hours)
   → Status: approved_by_hr, Level: 3, SLA: 2026-02-26 11:00
   → Audit: HR approved at 2026-02-24 11:00 from IP 192.168.1.20

4. Admin approves (final)
   → Status: approved (FINAL)
   → Audit: Admin approved at 2026-02-25 14:00 from IP 192.168.1.5
```

### Example 2: SLA Breach & Auto-Escalation

```
1. Employee submits expense request
   → Status: pending, Level: 1, SLA: 2026-02-22 10:00

2. Manager does NOT approve within 48 hours

3. Cron job detects SLA breach (2026-02-24 11:00)
   → Status: escalated
   → Audit: System escalated at 2026-02-24 11:00 from IP 'system'
   → Comment: "Auto-escalated due to SLA breach (48hrs)"
```

---

## ⚙️ Background Services

### Escalation Cron Job

**Runs**: Every 1 hour  
**Logic**:
```javascript
// Pseudocode
FOR EACH request WHERE:
  - status IN [pending, approved_by_manager, approved_by_hr]
  - slaDeadline < NOW
  - isEscalated = false
DO:
  - SET isEscalated = true
  - SET status = 'escalated'
  - ADD audit entry { action: 'escalated', comment: 'SLA breach' }
```

---

## 🎯 Key Technical Highlights

### 1. State Machine Pattern
```javascript
// Simplified state transition logic
if (currentLevel === 1 && action === 'approved') {
  status = 'approved_by_manager';
  currentLevel = 2;
  slaDeadline = Date.now() + 48 hours;
}
```

### 2. Audit Trail Implementation
```javascript
request.approvalMatrix.push({
  level: userLevel,
  role: req.user.role,
  approvedBy: req.user.id,
  action: 'approved',
  comment: req.body.comment,
  actionAt: new Date(),
  ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
});
```

### 3. RBAC Middleware
```javascript
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
```

---

## 🧪 Testing the API

### Using Postman

1. **Register users** with different roles
2. **Login** to get JWT tokens
3. **Submit requests** as employee
4. **Approve/reject** as manager/hr/admin
5. **Check dashboard** analytics

### Sample Test Flow
```bash
# 1. Register Employee
POST /api/auth/register
Body: { name: "Alice", email: "alice@test.com", password: "pass123", role: "employee" }

# 2. Register Manager
POST /api/auth/register
Body: { name: "Bob", email: "bob@test.com", password: "pass123", role: "manager" }

# 3. Login as Employee
POST /api/auth/login
Body: { email: "alice@test.com", password: "pass123" }
→ Copy token

# 4. Submit Request
POST /api/requests/submit
Headers: { Authorization: "Bearer <employee_token>" }
Body: { title: "Leave", description: "Vacation", type: "leave", ... }

# 5. Login as Manager & Approve
POST /api/auth/login
Body: { email: "bob@test.com", password: "pass123" }
→ Copy token

PATCH /api/requests/<request_id>/action
Headers: { Authorization: "Bearer <manager_token>" }
Body: { action: "approved", comment: "Approved!" }
```

---

## 📈 Future Enhancements

- [ ] Email notifications on approval/rejection
- [ ] File attachments for requests
- [ ] Advanced analytics with charts
- [ ] Admin panel for approval matrix configuration
- [ ] Multi-tenant support
- [ ] Request templates
- [ ] Bulk operations
- [ ] Export to PDF/Excel

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Avneesh Kaur**

- GitHub: [@avneeshkaur](https://github.com/avneeshkaur)
- LinkedIn: [Add your LinkedIn](https://www.linkedin.com/in/avneeshkaur-dev/)
- Email: avneeshkaur92@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB for the flexible database
- JWT for secure authentication
- The open-source community

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Avneesh Kaur

</div>
