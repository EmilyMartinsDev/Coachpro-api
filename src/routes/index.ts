import { Router } from "express";
import coachRoutes from "./coach";
import alunoRoutes from "./aluno";
import authRuter from "./auth.routes";


const globalRoutes = Router();

globalRoutes.use('/coach', coachRoutes);
globalRoutes.use("/aluno", alunoRoutes)
globalRoutes.use("/auth", authRuter)

export default globalRoutes;