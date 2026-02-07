# 🗄️ Database Setup Guide

## Quick Start

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hr_management;

# Exit psql
\q
```

### 2. Run Setup Script

**Option A: Using psql command line**

```bash
psql -U postgres -d hr_management -f database/setup.sql
```

**Option B: Using psql interactive mode**

```bash
psql -U postgres -d hr_management
\i database/setup.sql
```

**Option C: Copy and paste the SQL**

```bash
psql -U postgres -d hr_management << EOF
-- Paste contents of database/setup.sql here
EOF
```

### 3. Verify Installation

```bash
psql -U postgres -d hr_management -c "
  SELECT 'hr_users' AS table_name, COUNT(*) FROM hr_users
  UNION ALL
  SELECT 'employees', COUNT(*) FROM employees
  UNION ALL
  SELECT 'attendance', COUNT(*) FROM attendance;
"
```

---

## Using with Knex Migrations

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create `.env` file in project root:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_management
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=hr_management
```

### 3. Run Migrations

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npx knex migrate:rollback --knexfile knexfile.ts

# See migration status
npx knex migrate:status --knexfile knexfile.ts
```

### 4. Run Seeds (Optional)

```bash
npm run seed
```

---

## Database Schema

### Tables

#### `hr_users` - HR Admin/Staff Authentication

```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE NOT NULL)
- password_hash (VARCHAR NOT NULL)
- name (VARCHAR NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `employees` - Employee Records

```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR NOT NULL)
- age (INTEGER NOT NULL, > 0)
- designation (VARCHAR NOT NULL)
- hiring_date (DATE NOT NULL)
- date_of_birth (DATE NOT NULL)
- salary (DECIMAL(12,2) NOT NULL, > 0)
- email (VARCHAR UNIQUE)
- photo_path (VARCHAR)
- deleted_at (TIMESTAMP NULL) -- Soft delete
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Indexes:
- idx_employees_name
- idx_employees_email
- idx_employees_designation
- idx_employees_deleted_at
```

#### `attendance` - Daily Check-ins

```sql
- id (SERIAL PRIMARY KEY)
- employee_id (INTEGER NOT NULL) -> employees(id) CASCADE
- date (DATE NOT NULL)
- check_in_time (TIME NOT NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Constraints:
- UNIQUE(employee_id, date) -- One check-in per employee per day
- FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE

Indexes:
- idx_attendance_employee_id
- idx_attendance_date
- idx_attendance_employee_date
```

---

## Views (Optional Read-Only)

### `active_employees`

Shows only non-deleted employees (deleted_at IS NULL)

```sql
SELECT * FROM active_employees;
```

### `monthly_attendance_summary`

Monthly attendance report with days present and late counts

```sql
SELECT * FROM monthly_attendance_summary
WHERE month = '2026-02-01'::date;
```

---

## Sample Data

The setup script includes sample data:

**HR User:**

- Email: `admin@example.com`
- Password Hash: (bcrypt hashed)

**Sample Employees:**

- Rahim Uddin (Senior Developer)
- Fatima Ali (Junior Developer)
- Karim Hasan (Project Manager)
- Aisha Khan (HR Manager)
- Ahmed Hassan (DevOps Engineer)

**Sample Attendance Records:**

- Attendance records for Feb 1-5, 2026

To skip sample data, comment out Section 7 in `setup.sql`

---

## Useful PostgreSQL Commands

### Check Tables

```bash
psql -U postgres -d hr_management -c "\dt"
```

### View Table Structure

```bash
psql -U postgres -d hr_management -c "\d employees"
psql -U postgres -d hr_management -c "\d attendance"
```

### Query Data

```bash
psql -U postgres -d hr_management -c "SELECT * FROM employees;"
psql -U postgres -d hr_management -c "SELECT * FROM attendance LIMIT 10;"
```

### Check Indexes

```bash
psql -U postgres -d hr_management -c "
  SELECT tablename, indexname
  FROM pg_indexes
  WHERE schemaname = 'public';
"
```

### Reset Database

```bash
psql -U postgres -c "
  DROP DATABASE IF EXISTS hr_management;
  CREATE DATABASE hr_management;
"
psql -U postgres -d hr_management -f database/setup.sql
```

---

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL
# macOS with Homebrew:
brew services start postgresql

# Ubuntu/Debian:
sudo service postgresql start

# Windows:
# Use PostgreSQL Services from Services.msc
```

### Permission Denied

```bash
# Check PostgreSQL user
psql -U postgres -l

# Create new superuser if needed
psql -U postgres -c "CREATE USER hr_admin WITH PASSWORD 'password' SUPERUSER;"
```

### Database Already Exists

```bash
# Drop existing database
psql -U postgres -c "DROP DATABASE hr_management;"

# Then run setup.sql
psql -U postgres -d hr_management -f database/setup.sql
```

### Wrong Connection String

```bash
# Verify in .env file
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Example:
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_management
```

---

## Files Location

- **Setup Script**: `database/setup.sql`
- **Migrations**: `src/migrations/`
- **Seeds**: `src/seeds/`
- **Config**: `knexfile.ts`

---

## Next Steps

1. ✅ Run `database/setup.sql`
2. ✅ Configure `.env` with database credentials
3. ✅ Run `npm run migrate` (if using Knex)
4. ✅ Start server with `npm run dev`
5. ✅ Test API endpoints

Happy coding! 🚀
