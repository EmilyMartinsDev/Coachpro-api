import { Router } from 'express';
import alimentarController from '../controllers/alimentar.controller';

const router = Router();

router.get('/download/:id', ...alimentarController.downloadPlanoAlimentarArquivo);
router.get('/', ...alimentarController.getAllPlanosAlimentares);
router.get('/:id', ...alimentarController.getPlanoAlimentarById);
router.post('/', ...alimentarController.createPlanoAlimentar);

export default router;