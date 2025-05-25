import { AlunoAssinaturaController } from '@/controller/aluno/assinatura.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';
import multer from 'multer';


const alunoAssinaturasRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const controller = new AlunoAssinaturaController();
alunoAssinaturasRouter.use(authMiddleware, authorizeRole('ALUNO'));


alunoAssinaturasRouter.get(
    "/",
    controller.alunoListar
)

alunoAssinaturasRouter.post(
  '/:assinaturaId',
  upload.single('file'),
  (req, res) => controller.alunoEnviarComprovanteAssinatura(req, res)
);
alunoAssinaturasRouter.get(
    "/:assinaturaId",
    controller.alunoDetalhesAssinatura
)

export default alunoAssinaturasRouter;
