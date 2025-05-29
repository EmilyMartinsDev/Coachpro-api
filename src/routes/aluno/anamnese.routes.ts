import { AnamnesesAlunoController } from '@/controller/aluno/anamnese.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';
import multer from 'multer';


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const  anamneseAlunoRoutes = Router();


const controller = new AnamnesesAlunoController();
 anamneseAlunoRoutes.use(authMiddleware, authorizeRole('ALUNO'));


 anamneseAlunoRoutes.post(
    "/",
    controller.enviarAnamnese
)

 anamneseAlunoRoutes.post(
    "/:anamneseId",
      upload.single('file'),
    controller.alunoEnviarFotosAnamnese
)
export default  anamneseAlunoRoutes;
