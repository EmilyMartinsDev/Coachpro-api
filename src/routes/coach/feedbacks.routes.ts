
import { FeedbackController } from '@/controller/coach/feedback.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';
import multer from 'multer';


const  feedbackRoutes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const controller = new FeedbackController();
 feedbackRoutes.use(authMiddleware, authorizeRole('COACH'));


 feedbackRoutes.get(
    "/",
    controller.listar
)

 feedbackRoutes.patch(
  '/responder/:feedbackId',
  (req, res) => controller.responderFeedback(req, res)
);

 feedbackRoutes.get(
  '/:feedbackId',
  (req, res) => controller.detalhesFeedback(req, res)
);

export default  feedbackRoutes;
