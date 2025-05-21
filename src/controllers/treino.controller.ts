import { Request, Response } from 'express';
import { 
  getAllPlanosTreinoService,
  getPlanoTreinoByIdService,
  createPlanoTreinoService,
} from '../services/treino.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanoTreinoSchema } from '../schemas/treino.schema';
import { uploadFile } from '../config/upload';

export const getAllPlanosTreino = async (req: Request, res: Response) => {
  const planosTreino = await getAllPlanosTreinoService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planosTreino);
  res.status(200).json(response);
};

export const getPlanoTreinoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planoTreino = await getPlanoTreinoByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planoTreino);
  res.status(200).json(response);
};

export const createPlanoTreino = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('Arquivo não enviado');
  }
  const planoTreino = await createPlanoTreinoService(req.body, req.file, req.user!.id);
  const response = new ApiResponse(planoTreino);
  res.status(201).json(response);
};


export default {
  getAllPlanosTreino: [anyUserMiddleware, getAllPlanosTreino],
  getPlanoTreinoById: [anyUserMiddleware, getPlanoTreinoById],
  createPlanoTreino: [
    coachMiddleware, 
    uploadFile('arquivo'),
    validate(createPlanoTreinoSchema), 
    createPlanoTreino
  ],

};