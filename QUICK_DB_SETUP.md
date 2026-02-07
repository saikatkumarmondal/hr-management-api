# 🚀 PostgreSQL Database Setup - Quick Reference

## File Locations

```
database/
├── setup.sql          ← Complete schema (tables, indexes, views, sample data)
└── seed_data.sql      ← Additional test data for employees and attendance
```

## One-Line Setup (Fastest)

```bash
# Create database and run setup
psql -U postgres -c "CREATE DATABASE hr_management;" && \
psql -U postgres -d hr_management -f database/setup.sql && \
psql -U postgres -d hr_management -f database/seed_data.sql
```

## Step-by-Step Setup

### 1️⃣ Create Database

```bash
psql -U postgres
CREATE DATABASE hr_management;
\q
```

### 2️⃣ Run Schema Setup

```bash
psql -U postgres -d hr_management -f database/setup.sql
```

### 3️⃣ Load Sample Data

```bash
psql -U postgres -d hr_management -f database/seed_data.sql
```

### 4️⃣ Verify Installation

```bash
psql -U postgres -d hr_management -c "
  SELECT COUNT(*) as total_employees FROM employees;
  SELECT COUNT(*) as total_attendance FROM attendance;
"
```

## Or Use with Knex

```bash
# Configure .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_management

# Run migrations
npm install
npm run migrate

# Run seeds
npm run seed
```

## What Gets Created

### Tables

- ✅ `hr_users` (2 test users)
- ✅ `employees` (11 employees)
- ✅ `attendance` (200+ check-ins for Feb 2026)

### Indexes (for performance)

- ✅ 10+ indexes on frequently accessed columns

### Views (read-only)

- ✅ `active_employees` - non-deleted employees only
- ✅ `monthly_attendance_summary` - attendance reports

### Sample Data

- Admin user: `admin@example.com`
- Various employees with realistic attendance patterns

## Test API Immediately After Setup

```bash
# Start server
npm run dev

# In another terminal, login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Use JWT token to test
curl -H "Authorization: Bearer <JWT>" \
  "http://localhost:5000/employees"
```

## Key SQL Commands

```bash
# Connect to database
psql -U postgres -d hr_management

# Inside psql shell (\) commands:
\dt              # List all tables
\d employees     # Show table structure
\d+ indexes      # Show indexes
\dv              # List views
\q               # Quit

# Run queries:
SELECT * FROM employees;
SELECT * FROM attendance LIMIT 10;
SELECT * FROM monthly_attendance_summary;
```

## Database Credentials (Default)

```
Host: localhost
Port: 5432
Database: hr_management
User: postgres
Password: [your postgres password]
```

## Reset Everything

```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS hr_management;"
psql -U postgres -c "CREATE DATABASE hr_management;"
psql -U postgres -d hr_management -f database/setup.sql
```

## Files Documentation

| File                     | Purpose                                         | Size       |
| ------------------------ | ----------------------------------------------- | ---------- |
| `database/setup.sql`     | Complete schema + indexes + views + sample data | ~300 lines |
| `database/seed_data.sql` | Additional detailed test data                   | ~400 lines |
| `DATABASE_SETUP.md`      | Detailed guide with troubleshooting             | Full docs  |

---

**That's it! Your database is ready for the HR Management API.** 🎉
