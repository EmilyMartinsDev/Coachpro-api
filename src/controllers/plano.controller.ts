import { Request, Response } from 'express';
import { 
  getAllPlanosService, 
  createPlanoService, 
  updatePlanoService, 
  deletePlanoService, 
  getPlanoByIdService
} from '../services/plano.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanoSchema, updatePlanoSchema } from '../schemas/plano.schema';

export const getAllPlanos = async (req: Request, res: Response) => {
  const planos = await getAllPlanosService();
  const response = new ApiResponse(planos);
  res.status(200).json(response);
};

export const createPlano = async (req: Request, res: Response) => {
  const plano = await createPlanoService(req.body);
  const response = new ApiResponse(plano);
  res.status(201).json(response);
};

export const updatePlano = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plano = await updatePlanoService(id, req.body);
  const response = new ApiResponse(plano);
  res.status(200).json(response);
};

export const deletePlano = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletePlanoService(id);
  const response = new ApiResponse({ message: 'Plano removido com sucesso' });
  res.status(200).json(response);
};

export const getPlanoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const plano = await getPlanoByIdService(id);
  if (!plano) {
    return res.status(404).json({ message: 'Plano não encontrado' });
  }
  const response = new ApiResponse(plano);
  res.status(200).json(response);
};


export default {
  getAllPlanos,
  getPlanoById: [anyUserMiddleware, getPlanoById],
  createPlano: [coachMiddleware, validate(createPlanoSchema), createPlano],
  updatePlano: [coachMiddleware, validate(updatePlanoSchema), updatePlano],
  deletePlano: [coachMiddleware, deletePlano]
};