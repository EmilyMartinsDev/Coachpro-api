import { Request, Response } from "express";
import { AlunoListarTreinosParams, AlunoListarTreinosService } from "@/service/aluno/treinos/listar.service";

export class AlunoTreinoController {
  async listar(req: Request, res: Response) {
    try {
      const data = req.query as any;
      const alunoId = req.user.id;
      console.log(data)
      const service = new AlunoListarTreinosService();
      const dieta = await service.execute({ ...data, alunoId });

      return res.status(200).json(dieta);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Dieta não encontrada." });
    }
  }
}
