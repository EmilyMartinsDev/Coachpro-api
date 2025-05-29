import { Router } from "express";
import anamneseAlunoRoutes from "./anamnese.routes";
import alunoAssinaturasRouter from "./assinaturas.routes";
import alunoDietaRoutes from "./dieta.routes";
import alunoTreinoRouter from "./treino.routes";
import alunoFeedbackController from "./feedback.routes";
import  alunoAlunoRoutes  from "./aluno.routes";



const alunoRoutes = Router();

alunoRoutes.use('/anamneses', anamneseAlunoRoutes);
alunoRoutes.use("/assinaturas", alunoAssinaturasRouter)
alunoRoutes.use("/dietas", alunoDietaRoutes)
alunoRoutes.use("/treinos", alunoTreinoRouter)
alunoRoutes.use("/feedbacks", alunoFeedbackController)
alunoRoutes.use("/profile", alunoAlunoRoutes)

export default alunoRoutes;