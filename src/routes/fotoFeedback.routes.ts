import { Router } from 'express';
import fotoFeedbackController from '../controllers/fotoFeedback.controller';

const router = Router();

router.post('/:feedbackId/photos', ...fotoFeedbackController.createFotoFeedback);
router.get('/download/:fotoId', ...fotoFeedbackController.downloadFotoFeedback);

export default router;
