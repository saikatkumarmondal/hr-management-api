import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const empCtrl = new EmployeeController();

router.get('/', authMiddleware, empCtrl.getAll);
router.get('/:id', authMiddleware, empCtrl.getById);
// POST/PUT now accept JSON with photo_base64 (no multipart/file upload middleware)
router.post('/', authMiddleware, empCtrl.create);
router.put('/:id', authMiddleware, empCtrl.update);
router.delete('/:id', authMiddleware, empCtrl.delete);

export default router;
