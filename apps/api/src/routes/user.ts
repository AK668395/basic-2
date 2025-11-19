import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { AuthRequestSchema } from '@shared/schemas/validation';

const router = Router();

router.post('/register', validateRequest({ body: AuthRequestSchema }), register);
router.post('/login', validateRequest({ body: AuthRequestSchema }), login);

router.get('/:userId/profile', (req, res) => {
  res.json({ success: true, message: `Profile for user ${req.params.userId}` });
});

export default router;