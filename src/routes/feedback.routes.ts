import { Router } from 'express';
import feedbackController from '../controllers/feedback.controller';

const router = Router();

router.get('/', ...feedbackController.getAllFeedbacks);
router.get('/:id', ...feedbackController.getFeedbackById);
router.post('/', ...feedbackController.createFeedback);
router.put('/:id/responder', ...feedbackController.responderFeedback);
router.get('/aluno/:alunoId', ...feedbackController.getFeedbacksByAluno);

export default router;