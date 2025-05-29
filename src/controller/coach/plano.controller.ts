
import { CriarPlanoService } from "@/service/coach/plano/criar-plano.service";
import { ListarPlanosService } from "@/service/coach/plano/listar-planos.service";
import { Request, Response } from "express";


export class PlanoController {
  async cadastrarPlano(req: Request, res: Response) {
    try {
        const service = new CriarPlanoService();
        const {titulo, descricao, parcelamentos} =  req.body
        const plano = await service.execute({
            coachId: req.user.id,
            titulo,
            descricao,
            parcelamentos
        })

      return res.status(201).json(plano);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao cadastrar ." });
    }
  }
   async listarPlanos(req: Request, res: Response) {
    try {
        const service = new ListarPlanosService();
        
        const plano = await service.execute(req.user.id)

      return res.status(201).json(plano);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao listar ."+error });
    }
  }
}
