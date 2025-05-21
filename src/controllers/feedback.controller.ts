import { Request, Response } from 'express';
import { 
  getAllFeedbacksService,
  getFeedbackByIdService,
  createFeedbackService,
  responderFeedbackService,
  getFeedbacksByAlunoService
} from '../services/feedback.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createFeedbackSchema, responderFeedbackSchema } from '../schemas/feedback.schema';
import { uploadFiles } from '../config/upload';

export const getAllFeedbacks = async (req: Request, res: Response) => {
  const feedbacks = await getAllFeedbacksService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(feedbacks);
  res.status(200).json(response);
};

export const getFeedbackById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const feedback = await getFeedbackByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(feedback);
  res.status(200).json(response);
};

export const createFeedback = async (req: Request, res: Response) => {
  const feedback = await createFeedbackService(req.body, req.user!.id);
  const response = new ApiResponse(feedback);
  res.status(201).json(response);
};

export const responderFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const feedback = await responderFeedbackService(id, req.body, req.user!.id);
  const response = new ApiResponse(feedback);
  res.status(200).json(response);
};

export const getFeedbacksByAluno = async (req: Request, res: Response) => {
  const { alunoId } = req.params;
  const feedbacks = await getFeedbacksByAlunoService(alunoId, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(feedbacks);
  res.status(200).json(response);
};

export default {
  getAllFeedbacks: [anyUserMiddleware, getAllFeedbacks],
  getFeedbackById: [anyUserMiddleware, getFeedbackById],
  createFeedback: [
    anyUserMiddleware, 
    validate(createFeedbackSchema), 
    createFeedback
  ],
  responderFeedback: [
    coachMiddleware,
    validate(responderFeedbackSchema),
    responderFeedback
  ],
  getFeedbacksByAluno: [anyUserMiddleware, getFeedbacksByAluno]
};