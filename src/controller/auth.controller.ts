import { ApiResponse } from '@/utils/apiResponse';
import { Request, Response } from 'express';
import { login, registerAluno, registerCoach } from '../service/auth.service';
;

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
  login: [ loginHandler],
  registerCoach: [registerCoachHandler],
  registerAluno: [ registerAlunoHandler]
};
