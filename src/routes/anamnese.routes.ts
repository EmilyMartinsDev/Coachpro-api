import { Router } from 'express';
import anamneseController from '../controllers/anamnese.controller';

const router = Router();

router.get('/aluno/:alunoId', ...anamneseController.getAnamneseByAluno);
router.post('/', ...anamneseController.createAnamnese);

export default router;