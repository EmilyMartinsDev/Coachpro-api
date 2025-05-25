import { AnamnesesAlunoController } from '@/controller/aluno/anamnese.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';



const  anamneseAlunoRoutes = Router();


const controller = new AnamnesesAlunoController();
 anamneseAlunoRoutes.use(authMiddleware, authorizeRole('ALUNO'));


 anamneseAlunoRoutes.post(
    "/",
    controller.enviarAnamnese
)

export default  anamneseAlunoRoutes;
