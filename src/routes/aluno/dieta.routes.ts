
import { AlunoDietaController } from '@/controller/aluno/dieta.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';



const  alunoDietaRoutes = Router();


const controller = new AlunoDietaController();
 alunoDietaRoutes.use(authMiddleware, authorizeRole('ALUNO'));

 alunoDietaRoutes.get(
    "/",
    controller.listar
)

export default  alunoDietaRoutes;
