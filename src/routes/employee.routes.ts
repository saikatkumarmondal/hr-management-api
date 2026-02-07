import { Router } from 'express';
import multer from 'multer';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const empCtrl = new EmployeeController();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `photo-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', authMiddleware, empCtrl.getAll);
router.get('/:id', authMiddleware, empCtrl.getById);
router.post('/', authMiddleware, upload.single('photo'), empCtrl.create);
router.put('/:id', authMiddleware, upload.single('photo'), empCtrl.update);
router.delete('/:id', authMiddleware, empCtrl.delete);

export default router;
