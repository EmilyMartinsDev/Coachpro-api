
import { PlanoController } from '@/controller/coach/plano.controller';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';



const  planoRoutes = Router();


const controller = new PlanoController();
 planoRoutes.use(authMiddleware, authorizeRole('COACH'));


 planoRoutes.post(
    "/",
    controller.cadastrarPlano
)


export default  planoRoutes;
