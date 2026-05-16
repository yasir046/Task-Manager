# Ethara Task Manager

A modern, SaaS style Team Task Management Web Application built with React, Node.js, Express, and MongoDB. Inspired by Trello and Asana with role based access for Admins and Members.

**Live Demo**: [https://distinguished-renewal-production-2dac.up.railway.app](https://distinguished-renewal-production-2dac.up.railway.app)

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@ethara.com` | `password123` |
| **Member** | `member@ethara.com` | `password123` |

---

## Features

### Authentication and Roles
- JWT based authentication with configurable expiry
- Role based access: **Admin** and **Member** with separate dashboards
- Quick login buttons with auto filled demo credentials
- Sign up with project and team selection

### Admin Panel
- **Dashboard**: Real time analytics:
  - Tasks Analytics: 3 bar charts (STEM, NON STEM, TECHNICAL)
  - Total Tasks donut chart with project distribution
  - Tasks by Status segmented progress bar with counts
  - Tasks Per Project: 3 donut charts with team breakdown
  - Tasks by Team: horizontal bar charts with color coded teams
  - Overdue Tasks: count, distribution bar, and scrollable task list
- **Members**: Member management:
  - 3 column project based layout (default)
  - Search by name or email, filter by project or team
  - Show More or Show Less expandable cards with task assignments
  - Add Member modal (email, password, project, team)
  - Delete Member modal with cascading filters
- **Assign Tasks**: Two panel assignment workflow:
  - Project to Team cascading pill filters
  - Searchable task dropdown with recent tasks list
  - Individual member assignment with search
  - Team wide assignment (all members in a team)
  - Cancel or Delete assignments panel
- **Tasks**: Complete task management:
  - 3 column project based layout (default) with filter bar
  - Create Task modal with title, description, project, team, due date or time, priority, drag and drop file upload
  - Full screen task detail overlay with all fields, attachments, and download links
  - Edit task modal (due date, due time, project, team)
  - Assign Task modal with member dropdown

### Member Panel
- **Pending Tasks** filter (All, High, Medium, Low priority)
- **Task Cards** with inline status dropdown (To Do, In Progress, Done)
- **Urgent Tasks**: Cards glow red with animated border and URGENT badge when less than 2 hours remain
- Full screen task detail overlay with status update
- Profile section showing name, email, project, team

### Global Features
- **Real time Overdue Check**: Tasks past due date auto marked as Overdue on every page load and hourly cron
- **File Upload**: PDF, DOC, DOCX, images, ZIP, Markdown, TXT, CSV, Excel (max 10MB each)
- **File Download**: Secure downloads with JWT authentication via query token
- **Global Search**: Debounced search across tasks, teams, members
- **Responsive Design**: Desktop 3 column, tablet 2 column, mobile 1 column with hamburger sidebar
- **Loading Spinner**: Centered animated spinner on all page loads
- **Toast Notifications**: Success or error toasts with auto dismiss
- **Live Polling**: Real time task updates every 5 seconds
- **Auto Seeding**: Database auto seeds with default users and tasks on first deployment

### Design System
- Inter font globally
- Emerald green theme with dark green sidebar
- Project color palette: Emerald, Blue, Purple
- Rounded pill buttons, spacious padding, soft shadows
- Cream and off white modal backgrounds

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Charts** | Recharts (Bar, Pie or Donut) |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |
| **HTTP** | Axios |
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken, bcryptjs) |
| **File Upload** | Multer |
| **Cron Jobs** | node cron (overdue checker) |
| **Deployment** | Railway |

---

## Project Structure

```
Task-Manager/
├── backend/
│   ├── src/
│   │   ├── config/        # db.js
│   │   ├── controllers/   # auth, tasks, users, dashboard
│   │   ├── cron/           # overdueChecker.js
│   │   ├── middleware/     # auth.js, adminOnly.js, upload.js
│   │   ├── models/         # User.js, Task.js
│   │   ├── routes/         # auth, tasks, users, dashboard, files
│   │   ├── seed.js         # Seed default data
│   │   └── index.js        # Express entry point with auto seeding
│   ├── railway.json        # Railway deployment config
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance and API functions
│   │   ├── components/     # Layout, Sidebar, Header, Modal, TaskCard, Spinner, Charts
│   │   ├── context/        # AuthContext
│   │   ├── hooks/          # useDebounce
│   │   ├── pages/          # Login, Dashboard, AdminTasks, MemberTasks
│   │   ├── utils/          # helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── server.cjs          # Production Node HTTP server (SPA fallback)
│   ├── railway.json        # Railway deployment config
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18 or later
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ethara
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/register` | Public | Register new user |
| GET | `/api/auth/me` | Protected | Current user info |
| PATCH | `/api/auth/me` | Protected | Update profile |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | Protected | List tasks (with filters) |
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks/:id` | Protected | Task details |
| PATCH | `/api/tasks/:id/status` | Member | Update status |
| PATCH | `/api/tasks/:id/assign` | Admin | Assign to member |
| PATCH | `/api/tasks/:id/cancel` | Admin | Cancel assignment |
| DELETE | `/api/tasks/:id` | Admin | Delete task |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List members with task counts |
| POST | `/api/users` | Admin | Create member |
| GET | `/api/users/:id` | Admin | Member details |
| DELETE | `/api/users/:id` | Admin | Delete member |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/tasks-by-team` | Admin | Task counts by project and team |
| GET | `/api/dashboard/tasks-by-status` | Admin | Task counts by status |
| GET | `/api/dashboard/tasks-per-user` | Admin | Task counts per user |
| GET | `/api/dashboard/overdue-by-team` | Admin | Overdue counts by team |

### Files
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/files/:filename` | Query Token | Download uploaded file |

---

## Deployment

Deployed on Railway with separate frontend and backend services. Auto deploys on push to `main`.

### Railway Environment Variables

**Backend Service:**
- `PORT` : Server port (Railway sets this automatically)
- `MONGODB_URI` : MongoDB Atlas connection string
- `JWT_SECRET` : Secret key for JWT signing
- `JWT_EXPIRES_IN` : Token expiry duration (e.g. `7d`)

**Frontend Service:**
- `VITE_API_BASE_URL` : Backend API URL with `/api` suffix (e.g. `https://backend.up.railway.app/api`)

### Production Server

The frontend uses a built in Node HTTP server (`server.cjs`) that serves the Vite build output with SPA fallback routing. No external static server dependency required.
