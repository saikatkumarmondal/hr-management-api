-- ============================================================================
-- HR Management System - PostgreSQL Database Setup Script
-- ============================================================================
-- This script creates all necessary tables for the HR Management API
-- Database: PostgreSQL 12+
-- ============================================================================

-- ============================================================================
-- 1. DATABASE SETUP
-- ============================================================================

-- Create database (run as superuser)
-- CREATE DATABASE hr_management;

-- Switch to the database
-- \c hr_management;

-- ============================================================================
-- 2. EXTENSIONS
-- ============================================================================

-- Enable UUID extension (optional, if using UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 3. DROP EXISTING TABLES (if exists for fresh setup)
-- ============================================================================

DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS hr_users CASCADE;

-- ============================================================================
-- 4. CREATE TABLES
-- ============================================================================

-- HR Users Table (for authentication)
CREATE TABLE hr_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment
COMMENT ON TABLE hr_users IS 'Store HR admin/user credentials for authentication';
COMMENT ON COLUMN hr_users.id IS 'Primary key auto-increment';
COMMENT ON COLUMN hr_users.email IS 'Unique email for login';
COMMENT ON COLUMN hr_users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN hr_users.name IS 'Full name of HR user';

-- Employees Table (main employee records)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0),
  designation VARCHAR(255) NOT NULL,
  hiring_date DATE NOT NULL,
  date_of_birth DATE NOT NULL,
  salary DECIMAL(12, 2) NOT NULL CHECK (salary > 0),
  email VARCHAR(255) UNIQUE,
  photo_path VARCHAR(255),
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment
COMMENT ON TABLE employees IS 'Employee records with soft delete support';
COMMENT ON COLUMN employees.id IS 'Primary key auto-increment';
COMMENT ON COLUMN employees.name IS 'Full name of employee';
COMMENT ON COLUMN employees.age IS 'Age of employee (must be > 0)';
COMMENT ON COLUMN employees.designation IS 'Job position/title';
COMMENT ON COLUMN employees.hiring_date IS 'Date employee was hired';
COMMENT ON COLUMN employees.date_of_birth IS 'Date of birth for age verification';
COMMENT ON COLUMN employees.salary IS 'Monthly salary (must be > 0)';
COMMENT ON COLUMN employees.email IS 'Employee email (optional)';
COMMENT ON COLUMN employees.photo_path IS 'Path to employee photo in uploads folder';
COMMENT ON COLUMN employees.deleted_at IS 'Soft delete timestamp (NULL = active)';

-- Attendance Table (daily check-ins)
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  check_in_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint with cascade delete
  CONSTRAINT fk_attendance_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  
  -- Unique constraint: one check-in per employee per day
  CONSTRAINT unique_employee_per_day
    UNIQUE (employee_id, date)
);

-- Add comment
COMMENT ON TABLE attendance IS 'Daily attendance records with unique constraint per employee per day';
COMMENT ON COLUMN attendance.id IS 'Primary key auto-increment';
COMMENT ON COLUMN attendance.employee_id IS 'Foreign key to employees table';
COMMENT ON COLUMN attendance.date IS 'Date of attendance (YYYY-MM-DD)';
COMMENT ON COLUMN attendance.check_in_time IS 'Time of check-in (HH:mm:ss)';

-- ============================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- HR Users Indexes
CREATE INDEX idx_hr_users_email ON hr_users(email);

-- Employees Indexes
CREATE INDEX idx_employees_name ON employees(name);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_designation ON employees(designation);
CREATE INDEX idx_employees_deleted_at ON employees(deleted_at);

-- Attendance Indexes
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);

-- ============================================================================
-- 6. CREATE VIEWS (OPTIONAL)
-- ============================================================================

-- View: Active Employees Only
CREATE OR REPLACE VIEW active_employees AS
SELECT 
  id,
  name,
  age,
  designation,
  hiring_date,
  date_of_birth,
  salary,
  email,
  photo_path,
  created_at,
  updated_at
FROM employees
WHERE deleted_at IS NULL
ORDER BY name;

COMMENT ON VIEW active_employees IS 'View showing only active (non-deleted) employees';

-- View: Monthly Attendance Summary (read-only)
CREATE OR REPLACE VIEW monthly_attendance_summary AS
SELECT 
  e.id AS employee_id,
  e.name,
  DATE_TRUNC('month', a.date)::date AS month,
  COUNT(a.id) AS days_present,
  COUNT(CASE WHEN a.check_in_time > '09:45:00' THEN 1 END) AS times_late
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.name, DATE_TRUNC('month', a.date)
ORDER BY DATE_TRUNC('month', a.date) DESC, e.name;

COMMENT ON VIEW monthly_attendance_summary IS 'Monthly attendance report with days present and late counts';

-- ============================================================================
-- 7. SAMPLE DATA (OPTIONAL - Comment out if not needed)
-- ============================================================================

-- Insert sample HR user
INSERT INTO hr_users (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2b$10$KIXcw/9XDODjW8f6jHReLujx8c.mY3c9DCvCJ/9T.0eNBPwR0u4t6',
  'Admin User'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample employees
INSERT INTO employees (name, age, designation, hiring_date, date_of_birth, salary, email)
VALUES
  ('Rahim Uddin', 28, 'Senior Developer', '2022-06-15', '1997-10-20', 75000.00, 'rahim@example.com'),
  ('Fatima Ali', 26, 'Junior Developer', '2023-01-10', '1999-03-15', 50000.00, 'fatima@example.com'),
  ('Karim Hasan', 32, 'Project Manager', '2021-03-01', '1993-08-25', 80000.00, 'karim@example.com'),
  ('Aisha Khan', 29, 'HR Manager', '2021-09-20', '1996-12-10', 65000.00, 'aisha@example.com'),
  ('Ahmed Hassan', 30, 'DevOps Engineer', '2022-02-14', '1995-07-05', 85000.00, 'ahmed@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample attendance records
INSERT INTO attendance (employee_id, date, check_in_time)
VALUES
  (1, '2026-02-01', '09:15:00'),
  (1, '2026-02-02', '09:50:00'),
  (1, '2026-02-03', '08:45:00'),
  (1, '2026-02-04', '10:00:00'),
  (1, '2026-02-05', '09:30:00'),
  (2, '2026-02-01', '09:00:00'),
  (2, '2026-02-02', '08:50:00'),
  (2, '2026-02-03', '09:05:00'),
  (3, '2026-02-01', '09:20:00'),
  (3, '2026-02-02', '10:05:00'),
  (3, '2026-02-03', '09:40:00'),
  (3, '2026-02-04', '09:35:00'),
  (4, '2026-02-01', '08:55:00'),
  (4, '2026-02-02', '09:15:00'),
  (5, '2026-02-01', '09:10:00'),
  (5, '2026-02-02', '09:55:00')
ON CONFLICT (employee_id, date) DO NOTHING;

-- ============================================================================
-- 8. VERIFY SETUP
-- ============================================================================

-- Show tables
-- \dt

-- Show table structure
-- \d employees
-- \d attendance
-- \d hr_users

-- Count records
-- SELECT 'hr_users' AS table_name, COUNT(*) FROM hr_users
-- UNION ALL
-- SELECT 'employees', COUNT(*) FROM employees
-- UNION ALL
-- SELECT 'attendance', COUNT(*) FROM attendance;

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================
