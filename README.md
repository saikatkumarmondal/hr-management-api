# 🏢 HR Management System API

A professional, production-ready RESTful API for HR Management built with **Node.js, TypeScript, Express, and PostgreSQL**. Complete employee management, attendance tracking, and automated monthly reporting with JWT authentication.

> **Status:** ✅ Fully Functional | **Version:** 1.0.0 | **Node:** 16+ | **Database:** PostgreSQL 12+

---

## 🚀 Features

- ✅ **JWT Authentication** — Secure login with bcrypt password hashing
- ✅ **Employee Management** — Full CRUD with photo upload support and soft delete
- ✅ **Attendance Tracking** — Daily check-in system with unique constraint (1 record per day)
- ✅ **Monthly Reports** — Automated attendance summaries with late arrival tracking (after 09:45 AM)
- ✅ **Advanced Search** — Filter employees by name, attendance by date range
- ✅ **Input Validation** — Joi-based strict validation for all requests
- ✅ **Database Migrations** — Knex-based schema versioning and management
- ✅ **Clean Architecture** — Controller-Service-Repository pattern for maintainability
- ✅ **Error Handling** — Comprehensive error logging and response formatting
- ✅ **Pagination** — Configurable pagination on list endpoints

---

## 🛠️ Tech Stack

| Category          | Technology                            |
| ----------------- | ------------------------------------- |
| **Language**      | TypeScript 5.9+                       |
| **Runtime**       | Node.js 16+                           |
| **Framework**     | Express.js 5.2+                       |
| **Database**      | PostgreSQL 12+                        |
| **Query Builder** | Knex.js 3.1+                          |
| **Validation**    | Joi 18+                               |
| **Security**      | Bcrypt 6.0+, JWT 9.0+                 |
| **ORM/Migration** | Knex.js                               |
| **Dev Tools**     | ts-node, TypeScript, ESLint, Prettier |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) — [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** (v12 or higher) — [Download](https://www.postgresql.org/)
- **Git** — [Download](https://git-scm.com/)

Verify installations:

```bash
node --version
npm --version
psql --version
```

---

## 📂 Project Structure

```
hr-management-api/
├── src/
│   ├── config/              # Database & Multer configs
│   │   ├── db.ts            # PostgreSQL connection
│   │   └── multer.ts        # File upload config
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── employee.controller.ts
│   │   └── attendance.controller.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── employee.service.ts
│   │   └── attendance.service.ts
│   ├── repositories/        # Data access (Knex queries)
│   │   ├── hr.repository.ts
│   │   ├── employee.repository.ts
│   │   └── attendance.repository.ts
│   ├── interfaces/          # TypeScript types
│   │   ├── employee.interface.ts
│   │   ├── attendance.interface.ts
│   │   └── request.interface.ts
│   ├── middlewares/         # Express middlewares
│   │   └── auth.middleware.ts
│   ├── migrations/          # Database schema
│   │   └── *.ts
│   ├── routes/              # API endpoints
│   │   ├── auth.routes.ts
│   │   ├── employee.routes.ts
│   │   ├── attendance.routes.ts
│   │   └── report.routes.ts
│   ├── utils/               # Helpers & validators
│   │   ├── ApiResponse.ts
│   │   └── validators.ts
│   └── server.ts            # App entry point
├── database/                # Database scripts
│   ├── setup.sql            # Schema + indexes
│   └── seed_data.sql        # Test data
├── uploads/                 # Employee photos
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── knexfile.ts              # Knex config
└── README.md                # This file
```

---

## ⚙️ Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/hr-management-api.git
cd hr-management-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_management
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hr_management

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Step 4: Create PostgreSQL Database

**Using psql:**

```bash
psql -U postgres
CREATE DATABASE hr_management;
\q
```

**Or use the provided SQL script:**

```bash
psql -U postgres -d hr_management -f database/setup.sql
```

### Step 5: Run Database Migrations

```bash
# Using Knex CLI
npm run migrate

# Or using npx
npx knex migrate:latest --knexfile knexfile.ts
```

### Step 6: Load Sample Data (Optional)

```bash
# Using seed data script
psql -U postgres -d hr_management -f database/seed_data.sql

# Or using Knex seeds
npx knex seed:run --knexfile knexfile.ts
```

### Step 7: Start Development Server

```bash
npm run dev
```

Server will start at: `http://localhost:5000`

---

## 🎯 Build & Deployment

### Development Mode

```bash
npm run dev                # With hot reload
```

### Production Build

```bash
npm run build              # Compile TypeScript to JS
npm start                  # Run compiled code
```

### Docker Support (Optional)

```bash
docker build -t hr-api .
docker run -p 5000:5000 --env-file .env hr-api
```

---

## 📡 API Endpoints

### 🔐 Authentication

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "name": "Admin", "email": "admin@example.com" }
  },
  "message": "Login successful"
}
```

### 👥 Employees (All Protected with JWT)

#### List Employees

```http
GET /employees?page=1&limit=10&search=rahim
Authorization: Bearer <JWT_TOKEN>
```

#### Search Employees

```http
GET /employees?search=rahim
Authorization: Bearer <JWT_TOKEN>
```

#### Get Single Employee

```http
GET /employees/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Create Employee

```http
POST /employees
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe",
  "age": 28,
  "designation": "Senior Developer",
  "hiring_date": "2024-01-15",
  "date_of_birth": "1995-06-10",
  "salary": 75000,
  "photo_base64": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

#### Update Employee

```http
PUT /employees/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "designation": "Lead Developer",
  "salary": 85000
}
```

#### Delete Employee (Soft Delete)

```http
DELETE /employees/:id
Authorization: Bearer <JWT_TOKEN>
```

### ⏰ Attendance (All Protected with JWT)

#### Record Check-in

```http
POST /attendance
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "employee_id": 1,
  "date": "2026-02-07",
  "check_in_time": "09:30:00"
}
```

#### List Attendance (with filters)

```http
GET /attendance?page=1&limit=20&employee_id=3&from=2026-02-01&to=2026-02-28
Authorization: Bearer <JWT_TOKEN>
```

#### Get Single Attendance

```http
GET /attendance/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Update Attendance

```http
PUT /attendance/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "check_in_time": "10:00:00"
}
```

#### Delete Attendance

```http
DELETE /attendance/:id
Authorization: Bearer <JWT_TOKEN>
```

### 📊 Reports (All Protected with JWT)

#### Monthly Attendance Report

```http
GET /reports/attendance?month=2026-02
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "employee_id": 1,
      "name": "Rahim Uddin",
      "days_present": 20,
      "times_late": 5
    },
    {
      "employee_id": 3,
      "name": "Karim Hasan",
      "days_present": 18,
      "times_late": 3
    }
  ],
  "message": "Monthly attendance report generated"
}
```

#### Single Employee Report

```http
GET /reports/attendance?month=2026-02&employee_id=1
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Testing API with cURL

### Login & Get Token

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### List Employees

```bash
JWT="your_token_here"
curl -H "Authorization: Bearer $JWT" \
  http://localhost:5000/employees
```

### Record Attendance

```bash
JWT="your_token_here"
curl -X POST http://localhost:5000/attendance \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "date": "2026-02-07",
    "check_in_time": "09:30:00"
  }'
```

### Get Monthly Report

```bash
JWT="your_token_here"
curl -H "Authorization: Bearer $JWT" \
  "http://localhost:5000/reports/attendance?month=2026-02"
```

---

## 📝 Default Test Credentials

After running seed data:

| Email             | Password    | Role       |
| ----------------- | ----------- | ---------- |
| admin@example.com | password123 | HR Admin   |
| hr@example.com    | password123 | HR Manager |

**Note:** Hash shown in setup.sql is: `$2b$10$KIXcw/9XDODjW8f6jHReLujx8c.mY3c9DCvCJ/9T.0eNBPwR0u4t6`

---

## 🗄️ Database Management

### Run Migrations

```bash
# Latest migration
npm run migrate

# Create new migration
npx knex migrate:make create_new_table --knexfile knexfile.ts

# Rollback last migration
npx knex migrate:rollback --knexfile knexfile.ts

# Check status
npx knex migrate:status --knexfile knexfile.ts
```

### Database Setup Scripts

```bash
# Complete setup (run once)
psql -U postgres -d hr_management -f database/setup.sql

# Load test data
psql -U postgres -d hr_management -f database/seed_data.sql

# Reset to empty state
psql -U postgres -c "DROP DATABASE hr_management;"
psql -U postgres -c "CREATE DATABASE hr_management;"
psql -U postgres -d hr_management -f database/setup.sql
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify .env DATABASE_URL is correct
cat .env | grep DATABASE_URL

# Test connection manually
psql postgresql://postgres:password@localhost:5432/hr_management
```

### JWT Token Invalid/Expired

- Request a new token at `/auth/login`
- Check token expiry time in JWT_EXPIRE (.env)
- Verify JWT_SECRET matches between server and token generation

### Migrations Won't Run

```bash
# Check migration status
npx knex migrate:status --knexfile knexfile.ts

# Force specific migration version
npx knex migrate:up 20260206070155_create_hr_tables.ts --knexfile knexfile.ts

# Rollback all and retry
npx knex migrate:rollback --all --knexfile knexfile.ts
npm run migrate
```

---

## 📚 Documentation

- [Quick Database Setup](QUICK_DB_SETUP.md) — Fast database configuration
- [Complete Database Guide](DATABASE_SETUP.md) — Detailed schema and troubleshooting
- [Postman Collection](HR_API_Postman_Collection.json) — Import to test all endpoints
- [TypeScript Config](tsconfig.json) — Compiler settings
- [Knex Config](knexfile.ts) — Database configuration

---

## 📦 NPM Scripts

```bash
npm run dev          # Start with hot reload (ts-node-dev)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled server
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

---

## 🔒 Security Best Practices

✅ Always use HTTPS in production  
✅ Never commit `.env` file to git  
✅ Use strong JWT_SECRET (min 32 characters)  
✅ Implement rate limiting for production  
✅ Use environment-specific credentials  
✅ Validate all user inputs (Joi schema)  
✅ Hash passwords with bcrypt (already implemented)  
✅ Regular security updates for dependencies

---

## 🚀 Deployment

### Render.com / Railway.app / Heroku

```bash
# Build and deploy commands
npm install
npm run build
npm run migrate
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=<your_production_db_url>
JWT_SECRET=<your_strong_secret_key>
PORT=<your_port>
```

---

## 📞 Support & Contact

For issues or questions:

- Check [Troubleshooting](#-troubleshooting) section
- Review database setup docs
- Check console logs for error details
- Verify all environment variables are set

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Saikat Mondal**

---

**Last Updated:** February 7, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅

```

```
