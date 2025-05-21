import { Request, Response } from 'express';
import { 
  getAlunoByIdService, 
  getAlunosByCoachService, 
  updateAlunoService 
} from '../services/aluno.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateAlunoSchema } from '../schemas/aluno.schema';


export const getAlunoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const aluno = await getAlunoByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(aluno);
  res.status(200).json(response);
};

export const getAlunosByCoach = async (req: Request, res: Response) => {
  const { coachId } = req.params;
  const alunos = await getAlunosByCoachService(coachId, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(alunos);
  res.status(200).json(response);
};

export const updateAluno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const aluno = await updateAlunoService(id, req.body, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(aluno);
  res.status(200).json(response);
};

export default {
  getAlunoById: [anyUserMiddleware, getAlunoById],
  getAlunosByCoach: [coachMiddleware, getAlunosByCoach],
  updateAluno: [anyUserMiddleware, validate(updateAlunoSchema), updateAluno]
};