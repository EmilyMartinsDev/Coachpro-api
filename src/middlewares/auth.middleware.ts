import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt';

interface UserPayload {
  id: string;
  tipo: 'coach' | 'aluno';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authMiddleware = (allowedTypes: ('coach' | 'aluno')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Token de autenticação não fornecido');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

      // Verificar se o usuário ainda existe no banco de dados
      let userExists = false;
      
      if (decoded.tipo === 'coach') {
        const coach = await prisma.coach.findUnique({ where: { id: decoded.id } });
        userExists = !!coach;
      } else {
        const aluno = await prisma.aluno.findUnique({ where: { id: decoded.id } });
        userExists = !!aluno;
      }

      if (!userExists) {
        throw new ApiError(401, 'Usuário não encontrado');
      }

      if (!allowedTypes.includes(decoded.tipo)) {
        throw new ApiError(403, 'Acesso não autorizado');
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const coachMiddleware = authMiddleware(['coach']);
export const alunoMiddleware = authMiddleware(['aluno']);
export const anyUserMiddleware = authMiddleware(['coach', 'aluno']);
