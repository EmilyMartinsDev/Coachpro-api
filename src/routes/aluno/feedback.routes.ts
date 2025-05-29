
import { AlunoFeedbackController } from '@/controller/aluno/feedback.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';
import multer from 'multer';



const  alunoFeedbackController = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const controller = new AlunoFeedbackController();
 alunoFeedbackController.use(authMiddleware, authorizeRole('ALUNO'));

 alunoFeedbackController.get(
    "/",
    controller.alunoListarFeedbacks
)
 alunoFeedbackController.post(
    "/",
    controller.alunoEnviarFeedback
)
 alunoFeedbackController.get(
    "/:feedbackId",
    controller.alunoDetalhesFeedback
)
alunoFeedbackController.post(
  '/:feedbackId',
  upload.single('file'),
  (req, res) => controller.alunoEnviarFotosFeedback(req, res)
);
export default  alunoFeedbackController;
