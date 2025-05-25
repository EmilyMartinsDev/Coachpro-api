
import { AlunoTreinoController } from '@/controller/aluno/treino.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';



const  alunoTreinoRouter = Router();


const controller = new AlunoTreinoController();
 alunoTreinoRouter.use(authMiddleware, authorizeRole('ALUNO'));

 alunoTreinoRouter.get(
    "/",
    controller.listar
)

export default  alunoTreinoRouter;
