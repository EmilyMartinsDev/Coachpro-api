import { AlunoEnviarAnamneseService, ICreateAnamneseInput } from "@/service/aluno/anamnese/enviar-anamnese.service";
import { DetalhesAnamneseService } from "@/service/coach/anamnese/detalhes.service";
import { ListarAnamnesesParams, ListarAnamnesesService } from "@/service/coach/anamnese/listar.service";
import { Request, Response } from "express";


export class AnamnesesAlunoController {
  async enviarAnamnese(req: Request, res: Response) {
    try {
      const data = req.body as ICreateAnamneseInput;
    const alunoId = req.user.id
      const service = new AlunoEnviarAnamneseService();
      const anamnese = await service.execute({...data, alunoId: alunoId});

      return res.status(200).json(anamnese);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Anamnese não encontrada." });
    }
  }
}
