import { Request, Response } from 'express';
import { 
  getAllPlanosAlimentaresService,
  getPlanoAlimentarByIdService,
  createPlanoAlimentarService,
} from '../services/alimentar.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanoAlimentarSchema } from '../schemas/alimentar.schema';
import { uploadFile } from '../config/upload';

export const getAllPlanosAlimentares = async (req: Request, res: Response) => {
  const planosAlimentares = await getAllPlanosAlimentaresService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planosAlimentares);
  res.status(200).json(response);
};

export const getPlanoAlimentarById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planoAlimentar = await getPlanoAlimentarByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planoAlimentar);
  res.status(200).json(response);
};

export const createPlanoAlimentar = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('Arquivo não enviado');
  }
  const planoAlimentar = await createPlanoAlimentarService(req.body, req.file, req.user!.id);
  const response = new ApiResponse(planoAlimentar);
  res.status(201).json(response);
};

export default {
  getAllPlanosAlimentares: [anyUserMiddleware, getAllPlanosAlimentares],
  getPlanoAlimentarById: [anyUserMiddleware, getPlanoAlimentarById],
  createPlanoAlimentar: [
    coachMiddleware, 
    uploadFile('arquivo'),
    validate(createPlanoAlimentarSchema), 
    createPlanoAlimentar
  ],

};