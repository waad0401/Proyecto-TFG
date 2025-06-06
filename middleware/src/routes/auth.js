import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

const email = body('email').isEmail().normalizeEmail();
const password = body('password').isLength({ min: 8 });

router.post('/register', [email, password], register);
router.post('/login',    [email, password], login);

export default router;
