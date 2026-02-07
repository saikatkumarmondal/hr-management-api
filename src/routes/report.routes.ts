import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const attCtrl = new AttendanceController();

router.get('/attendance', authMiddleware, attCtrl.getMonthlyReport);

export default router;
