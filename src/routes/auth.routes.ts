import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', ...authController.login);
router.post('/coach/register', ...authController.registerCoach);
router.post('/aluno/register', ...authController.registerAluno);

export default router;
