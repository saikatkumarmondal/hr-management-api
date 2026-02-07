import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const attCtrl = new AttendanceController();

// All routes are protected by JWT
router.use(authMiddleware);

router.get('/', attCtrl.getAll); // List attendance with filters
router.get('/:id', attCtrl.getById); // Get single entry
router.post('/', attCtrl.upsert); // Create or Update (Upsert)
router.put('/:id', attCtrl.update); // Direct update by ID
router.delete('/:id', attCtrl.delete); // Delete entry

export default router;
