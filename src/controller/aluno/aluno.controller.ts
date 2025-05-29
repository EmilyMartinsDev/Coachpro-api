import { AlunoDetalhesService } from "@/service/aluno/me/aluno.detail.service"
import { Request, Response } from "express";

export class AlunoProfileController {
 async detalhesAluno(req: Request, res: Response) {
    try {
      const service = new AlunoDetalhesService()
      const aluno = await service.execute(req.user.id)

      return res.status(200).json(aluno)
    } catch (error: any) {
      console.error("Erro ao buscar detalhes do aluno:", error)
      return res.status(404).json({ error: error.message || "Erro ao buscar dados do aluno." })
    }
  }
}
