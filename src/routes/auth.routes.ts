import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import { loginSchema } from '../utils/validators';

const router = Router();
const authService = new AuthService();

router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return sendError(res, 'Validation error', error.details[0].message, 400);

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, 'Login successful', result);
  } catch (error) {
    return sendError(res, 'Login failed', error, 401);
  }
});

export default router;
