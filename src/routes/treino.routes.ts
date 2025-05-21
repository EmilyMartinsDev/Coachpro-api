import { Router } from 'express';
import treinoController from '../controllers/treino.controller';

const router = Router();

router.get('/', ...treinoController.getAllPlanosTreino);
router.get('/:id', ...treinoController.getPlanoTreinoById);
router.post('/', ...treinoController.createPlanoTreino);


export default router;