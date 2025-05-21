import { Router } from 'express';
import coachController from '../controllers/coach.controller';

const router = Router();

router.get('/', coachController.getAllCoaches);
router.get('/:id', ...coachController.getCoachById);
router.put('/:id', ...coachController.updateCoach);

export default router;