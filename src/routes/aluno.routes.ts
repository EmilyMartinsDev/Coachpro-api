import { Router } from 'express';
import alunoController from '../controllers/aluno.controller';

const router = Router();
router.get('/:id', ...alunoController.getAlunoById);
router.get('/coach/:coachId', ...alunoController.getAlunosByCoach);
router.put('/:id', ...alunoController.updateAluno);

export default router;