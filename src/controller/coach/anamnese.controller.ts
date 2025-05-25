import { DetalhesAnamneseService } from "../../service/coach/anamnese/detalhes.service";
import { ListarAnamnesesParams, ListarAnamnesesService } from "../../service/coach/anamnese/listar.service";
import { Request, Response } from "express";


export class AnamnesesController {
  async listar(req: Request, res: Response) {
    try {
      const coachId = req.user.id;

      const { search, page, alunoId, dataFim, dataInicio, page_size } = req.query as any;

      const service = new ListarAnamnesesService();

      const result = await service.execute({
        search: search as string,
        page: page ? Number(page) : 1,
        alunoId,
        page_size: page_size ? Number(page_size) : 10,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar anamneses." });
    }
  }
  async detalhesAnamnese(req: Request, res: Response) {
    try {
      const { anamneseId } = req.params;

      const service = new DetalhesAnamneseService();
      const anamnese = await service.execute(anamneseId);

      return res.status(200).json(anamnese);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Anamnese não encontrada." });
    }
  }
}
