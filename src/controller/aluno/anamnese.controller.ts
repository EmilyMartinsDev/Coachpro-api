import { AlunoEnviarAnamneseService, ICreateAnamneseInput } from "@/service/aluno/anamnese/enviar-anamnese.service";
import { AlunoEnviarFotoAnamneseService } from "@/service/aluno/anamnese/enviarFotoAnamnese.service";
import { DetalhesAnamneseService } from "@/service/coach/anamnese/detalhes.service";
import { ListarAnamnesesParams, ListarAnamnesesService } from "@/service/coach/anamnese/listar.service";
import { Request, Response } from "express";


export class AnamnesesAlunoController {
  async enviarAnamnese(req: Request, res: Response) {
    try {
      let data = req.body as ICreateAnamneseInput;
    const alunoId = req.user.id
      const service = new AlunoEnviarAnamneseService();
      data.dataNascimento = new Date(data.dataNascimento)
      data.dataPreenchimento =  new Date(data.dataPreenchimento)
      const anamnese = await service.execute({...data, alunoId: alunoId});

      return res.status(200).json(anamnese);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Anamnese não encontrada." });
    }
  }

      async alunoEnviarFotosAnamnese(req: Request, res: Response) {
          try {
  
              const { anamneseId } = req.params as any
                  const file = {
                  base64: req.file.buffer.toString('base64'),
                  mimetype: req.file.mimetype,
                  originalname: req.file.originalname,
              };
              const service = new AlunoEnviarFotoAnamneseService()
              const fotos = await service.execute({
                  anamneseId,
                  file
              })
  
              return res.status(201).json(fotos);
          } catch (error) {
              return res.status(500).json({ error: error.message });
          }
      }
  
}
