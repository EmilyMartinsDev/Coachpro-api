import { Router } from "express";
import authRoutes from "../auth.routes";
import { alunoRoutes } from "./aluno.routes";
import anamneseRoutes from "./anamnese.routes";
import assinaturaRouter from "./assinatura.routes";
import feedbackRoutes from "./feedbacks.routes";
import planoRoutes from "./plano.routes";


const coachRoutes = Router();

coachRoutes.use('/alunos', alunoRoutes);
coachRoutes.use("/anamneses", anamneseRoutes)
coachRoutes.use("/assinaturas", assinaturaRouter)
coachRoutes.use("/feedbacks", feedbackRoutes)
coachRoutes.use("/planos", planoRoutes)


export default coachRoutes;