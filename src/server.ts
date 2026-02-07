import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import reportRoutes from './routes/report.routes';
import db from './config/db';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Reject multipart/form-data to /employees — must use JSON
app.use((req, res, next) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.path.startsWith('/employees') &&
    req.headers['content-type']?.includes('multipart/form-data')
  ) {
    return res.status(400).json({
      success: false,
      message:
        'POST/PUT /employees requires Content-Type: application/json with a JSON body.',
      steps: [
        '1. Click Body tab',
        '2. Change "form-data" → "raw"',
        '3. Click dropdown, select "JSON"',
        '4. Paste JSON with: name, age, designation, hiring_date, date_of_birth, salary',
        '5. Headers tab: Content-Type: application/json, Authorization: Bearer <JWT>',
        '6. Send',
      ],
    });
  }
  next();
});

// Debug middleware for /employees POST/PUT to see actual body received
app.use((req, res, next) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.path.startsWith('/employees')
  ) {
    console.log('--- /employees request ---');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    console.log(
      'Body is empty?',
      !req.body || Object.keys(req.body).length === 0,
    );
  }
  next();
});

// --- Routes Registration ---
app.use('/auth', authRoutes); // POST /auth/login
app.use('/employees', employeeRoutes); // GET, POST, PUT, DELETE /employees
app.use('/attendance', attendanceRoutes); // GET, POST, PUT, DELETE /attendance
app.use('/reports', reportRoutes); // GET /reports/attendance

// Global error handler for parsing and request errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err) return next();

  // Check if multipart/form-data was sent to /employees endpoint
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.path.startsWith('/employees') &&
    req.headers['content-type']?.includes('multipart/form-data')
  ) {
    console.error(
      'Multipart request to /employees (no longer supported):',
      err.message,
    );
    return res.status(400).json({
      success: false,
      message:
        'POST/PUT /employees now require JSON with photo_base64 field. Multipart/form-data is no longer supported.',
      hint: 'Send Content-Type: application/json with "photo_base64": "data:image/jpeg;base64,..." in the body.',
      error: err.message,
    });
  }

  // Generic JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: err.message,
    });
  }

  // Fallback error response
  console.error('Server error:', err);
  return res
    .status(500)
    .json({ success: false, message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // quick test query to ensure DB connection is valid
    await db.raw('select 1+1 as result');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('✅ Database connected');
    });

    // handle graceful shutdown
    process.on('SIGINT', () => {
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }
}

start();
