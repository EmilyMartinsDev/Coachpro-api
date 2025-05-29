
import { AnamnesesController } from '../../controller/coach/anamnese.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';



const  anamneseRoutes = Router();


const controller = new AnamnesesController();
 anamneseRoutes.use(authMiddleware, authorizeRole('COACH'));


 anamneseRoutes.get(
    "/",
    controller.listar
)
 anamneseRoutes.patch(
    "/:anamneseId",
    controller.atualizarAnamnese
)
 anamneseRoutes.get(
  '/:anamneseId',
  (req, res) => controller.detalhesAnamnese(req, res)
);

export default  anamneseRoutes;
