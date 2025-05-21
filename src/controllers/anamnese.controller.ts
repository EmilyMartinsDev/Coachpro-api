import { Request, Response } from 'express';
import { 
  getAnamneseByAlunoService,
  createAnamneseService
} from '../services/anamnese.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAnamneseSchema } from '../schemas/anamnese.schema';

export const getAnamneseByAluno = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const anamnese = await getAnamneseByAlunoService(alunoId, req.user!.id, req.user!.tipo);
    if (!anamnese) {
      return res.status(404).json({ message: 'Anamnese não encontrada' });
    }
    const response = new ApiResponse(anamnese);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar anamnese', error: (error as Error).message });
  }
};

export const createAnamnese = async (req: Request, res: Response) => {
  try {
    const anamnese = await createAnamneseService(req.body, req.user!.id);
    const response = new ApiResponse(anamnese);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar anamnese', error: (error as Error).message });
  }
};

export default {
  getAnamneseByAluno: [anyUserMiddleware, getAnamneseByAluno],
  createAnamnese: [
    anyUserMiddleware,
    validate(createAnamneseSchema),
    createAnamnese
  ]
};