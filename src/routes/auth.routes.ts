import { Router } from 'express';
import { authController } from '../controller/auth.controller';


const authRuter = Router();

authRuter.post('/login', ...authController.login);
authRuter.post('/coach/register', ...authController.registerCoach);
authRuter.post('/aluno/register', ...authController.registerAluno);

export default authRuter;
