import { Router } from 'express';
import planoController from '../controllers/plano.controller';

const router = Router();

router.get('/', planoController.getAllPlanos);
router.post('/', ...planoController.createPlano);
router.put('/:id', ...planoController.updatePlano);
router.delete('/:id', ...planoController.deletePlano);
router.get('/:id', ...planoController.getPlanoById);

export default router;