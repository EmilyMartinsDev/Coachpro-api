import { AlunoProfileController } from "@/controller/aluno/aluno.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { authorizeRole } from "@/middlewares/role.middleware";
import { Router } from "express";

const  alunoAlunoRoutes = Router();


const controller = new AlunoProfileController();
 alunoAlunoRoutes.use(authMiddleware, authorizeRole('ALUNO'));

 alunoAlunoRoutes.use("/", controller.detalhesAluno)
 export default  alunoAlunoRoutes;