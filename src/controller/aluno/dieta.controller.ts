import { Request, Response } from "express";
import { AlunoListarDietaParams, AlunoListarDietaService } from "@/service/aluno/dieta/listar.service";

export class AlunoDietaController {
  async listar(req: Request, res: Response) {
    try {
      const data = req.query as any;
      const alunoId = req.user.id;

      const service = new AlunoListarDietaService();
      const dieta = await service.execute({ ...data, alunoId });

      return res.status(200).json(dieta);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Dieta não encontrada." });
    }
  }
}
