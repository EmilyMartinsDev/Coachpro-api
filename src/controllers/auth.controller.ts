import { Request, Response } from 'express';
import { login, registerCoach, registerAluno } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerCoachSchema, registerAlunoSchema } from '../schemas/auth.schema';

export const loginHandler = async (req: Request, res: Response) => {
  const result = await login(req.body);
  const response = new ApiResponse(result);
  res.status(200).json(response);
};

export const registerCoachHandler = async (req: Request, res: Response) => {
    console.log(req.body);
  const result = await registerCoach(req.body);
  const response = new ApiResponse(result);
  res.status(201).json(response);
};

export const registerAlunoHandler = async (req: Request, res: Response) => {
  const result = await registerAluno(req.body);
  const response = new ApiResponse(result);
  res.status(201).json(response);
};

export const authController = {
  login: [validate(loginSchema), loginHandler],
  registerCoach: [validate(registerCoachSchema), registerCoachHandler],
  registerAluno: [validate(registerAlunoSchema), registerAlunoHandler]
};
