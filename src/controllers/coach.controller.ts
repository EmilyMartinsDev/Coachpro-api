import { Request, Response } from 'express';
import { 
  getAllCoachesService, 
  getCoachByIdService, 
  updateCoachService 
} from '../services/coach.service';
import { ApiResponse } from '../utils/apiResponse';
import { coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateCoachSchema } from '../schemas/coach.schema';

export const getAllCoaches = async (req: Request, res: Response) => {
  const coaches = await getAllCoachesService();
  const response = new ApiResponse(coaches);
  res.status(200).json(response);
};

export const getCoachById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const coach = await getCoachByIdService(id);
  const response = new ApiResponse(coach);
  res.status(200).json(response);
};

export const updateCoach = async (req: Request, res: Response) => {
  const { id } = req.params;
  const coach = await updateCoachService(id, req.body);
  const response = new ApiResponse(coach);
  res.status(200).json(response);
};

export default {
  getAllCoaches,
  getCoachById: [coachMiddleware, getCoachById],
  updateCoach: [coachMiddleware, validate(updateCoachSchema), updateCoach]
};