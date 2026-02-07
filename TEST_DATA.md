# 👥 Employee POST API - Dummy Test Data

## Quick Test Data (Copy & Paste Ready)

### 1️⃣ Simple Employee (No Photo)

```json
{
  "email": "john.doe@company.com",
  "name": "John Doe",
  "age": 28,
  "designation": "Senior Developer",
  "hiring_date": "2024-01-15",
  "date_of_birth": "1995-06-10",
  "salary": 75000
}
```

### 2️⃣ Junior Employee

```json
{
  "email": "sarah.johnson@company.com",
  "name": "Sarah Johnson",
  "age": 24,
  "designation": "Junior Frontend Developer",
  "hiring_date": "2024-08-01",
  "date_of_birth": "2000-03-22",
  "salary": 45000
}
```

### 3️⃣ Manager

```json
{
  "email": "michael.brown@company.com",
  "name": "Michael Brown",
  "age": 35,
  "designation": "Engineering Manager",
  "hiring_date": "2022-04-10",
  "date_of_birth": "1988-11-05",
  "salary": 95000
}
```

### 4️⃣ Designer

```json
{
  "email": "emma.wilson@company.com",
  "name": "Emma Wilson",
  "age": 26,
  "designation": "UI/UX Designer",
  "hiring_date": "2023-06-20",
  "date_of_birth": "1997-08-15",
  "salary": 60000
}
```

### 5️⃣ DevOps Engineer

```json
{
  "email": "alex.kumar@company.com",
  "name": "Alex Kumar",
  "age": 31,
  "designation": "DevOps Engineer",
  "hiring_date": "2023-02-14",
  "date_of_birth": "1992-09-28",
  "salary": 85000
}
```

### 6️⃣ QA Specialist

```json
{
  "email": "priya.sharma@company.com",
  "name": "Priya Sharma",
  "age": 27,
  "designation": "QA Specialist",
  "hiring_date": "2023-11-01",
  "date_of_birth": "1998-05-12",
  "salary": 55000
}
```

### 7️⃣ Product Manager

```json
{
  "email": "david.lee@company.com",
  "name": "David Lee",
  "age": 33,
  "designation": "Product Manager",
  "hiring_date": "2022-09-15",
  "date_of_birth": "1990-04-08",
  "salary": 90000
}
```

### 8️⃣ Full Stack Developer

```json
{
  "email": "rachel.martin@company.com",
  "name": "Rachel Martin",
  "age": 29,
  "designation": "Full Stack Developer",
  "hiring_date": "2023-03-20",
  "date_of_birth": "1996-07-14",
  "salary": 78000
}
```

---

## 🧪 cURL Test Commands

### Test 1: Create Simple Employee

```bash
JWT="your_jwt_token_here"

curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "name": "John Doe",
    "age": 28,
    "designation": "Senior Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1995-06-10",
    "salary": 75000
  }'
```

### Test 2: Create Multiple Employees (Batch)

```bash
JWT="your_jwt_token_here"

# Employee 1
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"email":"emp1@company.com","name":"Employee One","age":28,"designation":"Developer","hiring_date":"2024-01-15","date_of_birth":"1995-06-10","salary":75000}'

# Employee 2
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"email":"emp2@company.com","name":"Employee Two","age":26,"designation":"Designer","hiring_date":"2023-06-20","date_of_birth":"1997-08-15","salary":60000}'

# Employee 3
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"email":"emp3@company.com","name":"Employee Three","age":35,"designation":"Manager","hiring_date":"2022-04-10","date_of_birth":"1988-11-05","salary":95000}'
```

### Test 3: Employee with Base64 Photo

```bash
JWT="your_jwt_token_here"

# Using a small sample base64 image
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "photo.user@company.com",
    "name": "Photo User",
    "age": 30,
    "designation": "Senior Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1993-06-10",
    "salary": 80000,
    "photo_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABQAFADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ydn5KjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
  }'
```

---

## 🔍 Validation Test Cases

### ❌ Test 1: Missing Required Field (email)

```bash
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 28,
    "designation": "Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1995-06-10",
    "salary": 75000
  }'
```

**Expected:** 400 - "email" is required

### ❌ Test 2: Invalid Email Format

```bash
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "name": "John Doe",
    "age": 28,
    "designation": "Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1995-06-10",
    "salary": 75000
  }'
```

**Expected:** 400 - "email" must be a valid email

### ❌ Test 3: Age Less Than 18

```bash
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "minor@company.com",
    "name": "Minor Employee",
    "age": 16,
    "designation": "Intern",
    "hiring_date": "2024-01-15",
    "date_of_birth": "2008-01-01",
    "salary": 20000
  }'
```

**Expected:** 400 - "age" must be greater than or equal to 18

### ❌ Test 4: Negative Salary

```bash
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "negative.salary@company.com",
    "name": "Negative Salary",
    "age": 28,
    "designation": "Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1995-06-10",
    "salary": -50000
  }'
```

**Expected:** 400 - "salary" must be a positive number

### ❌ Test 5: Invalid Date Format

```bash
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid.date@company.com",
    "name": "Invalid Date",
    "age": 28,
    "designation": "Developer",
    "hiring_date": "01/15/2024",
    "date_of_birth": "1995-06-10",
    "salary": 75000
  }'
```

**Expected:** 400 - "hiring_date" must be in ISO 8601 date format

### ❌ Test 6: Duplicate Email

```bash
# First request (succeeds)
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@company.com",
    "name": "First User",
    "age": 28,
    "designation": "Developer",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1995-06-10",
    "salary": 75000
  }'

# Second request with same email (fails)
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@company.com",
    "name": "Second User",
    "age": 30,
    "designation": "Manager",
    "hiring_date": "2024-01-15",
    "date_of_birth": "1993-06-10",
    "salary": 95000
  }'
```

**Expected:** 400 - Email already exists

---

## 📊 Bulk Test Script (Bash)

Save as `test_employees.sh`:

```bash
#!/bin/bash

# Get JWT token first
JWT_RESPONSE=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@example.com",
    "password":"password123"
  }')

JWT=$(echo $JWT_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "🔐 Using JWT: $JWT"
echo "========================================"

# Array of test employees
declare -a EMPLOYEES=(
  '{"email":"john.doe@company.com","name":"John Doe","age":28,"designation":"Senior Developer","hiring_date":"2024-01-15","date_of_birth":"1995-06-10","salary":75000}'
  '{"email":"sarah.johnson@company.com","name":"Sarah Johnson","age":24,"designation":"Junior Frontend Developer","hiring_date":"2024-08-01","date_of_birth":"2000-03-22","salary":45000}'
  '{"email":"michael.brown@company.com","name":"Michael Brown","age":35,"designation":"Engineering Manager","hiring_date":"2022-04-10","date_of_birth":"1988-11-05","salary":95000}'
  '{"email":"emma.wilson@company.com","name":"Emma Wilson","age":26,"designation":"UI/UX Designer","hiring_date":"2023-06-20","date_of_birth":"1997-08-15","salary":60000}'
  '{"email":"alex.kumar@company.com","name":"Alex Kumar","age":31,"designation":"DevOps Engineer","hiring_date":"2023-02-14","date_of_birth":"1992-09-28","salary":85000}'
  '{"email":"priya.sharma@company.com","name":"Priya Sharma","age":27,"designation":"QA Specialist","hiring_date":"2023-11-01","date_of_birth":"1998-05-12","salary":55000}'
  '{"email":"david.lee@company.com","name":"David Lee","age":33,"designation":"Product Manager","hiring_date":"2022-09-15","date_of_birth":"1990-04-08","salary":90000}'
  '{"email":"rachel.martin@company.com","name":"Rachel Martin","age":29,"designation":"Full Stack Developer","hiring_date":"2023-03-20","date_of_birth":"1996-07-14","salary":78000}'
)

# Create each employee
for i in "${!EMPLOYEES[@]}"; do
  echo "📝 Creating Employee $((i+1))..."

  RESPONSE=$(curl -s -X POST http://localhost:5000/employees \
    -H "Authorization: Bearer $JWT" \
    -H "Content-Type: application/json" \
    -d "${EMPLOYEES[$i]}")

  echo "$RESPONSE" | jq '.'
  echo "✅ Employee $((i+1)) created"
  echo "========================================"
  sleep 1
done

echo "🎉 All employees created successfully!"
```

Run it:

```bash
chmod +x test_employees.sh
./test_employees.sh
```

---

## 🔄 Test Workflow (Complete Flow)

```bash
# 1. Start server
npm run dev

# 2. Get JWT token
JWT=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | jq -r '.data.token')

echo "Token: $JWT"

# 3. Create employee
curl -X POST http://localhost:5000/employees \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@company.com",
    "name":"Test Employee",
    "age":28,
    "designation":"Developer",
    "hiring_date":"2024-01-15",
    "date_of_birth":"1995-06-10",
    "salary":75000
  }'

# 4. List all employees
curl -H "Authorization: Bearer $JWT" \
  http://localhost:5000/employees

# 5. Get specific employee
curl -H "Authorization: Bearer $JWT" \
  http://localhost:5000/employees/1

# 6. Search employees
curl -H "Authorization: Bearer $JWT" \
  "http://localhost:5000/employees?search=test"
```

---

## 📈 Data Summary

| Count | Data Type                  |
| ----- | -------------------------- |
| 8     | Complete Employee Examples |
| 6     | Validation Test Cases      |
| 1     | Bulk Test Script           |

**Total Test Coverage:** All fields, validations, errors, and success scenarios ✅

---

### 🚀 Quick Start

1. Copy any JSON example
2. Login to get JWT token
3. Paste into cURL command with `$JWT` variable
4. Execute and test!

Happy testing! 🎉
