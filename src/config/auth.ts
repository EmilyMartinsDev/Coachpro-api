import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { ApiError } from '../utils/apiError';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido no .env');
}

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


export const generateToken = (userId: string, role: 'COACH' | 'ALUNO'): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { 
    subject: userId,
    expiresIn:"7d" 
  });
};

export const verifyToken = (token: string): { id: string; role: 'COACH' | 'ALUNO' } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: 'COACH' | 'ALUNO' };
};

export const authenticateUser = async (
  email: string,
  password: string,
  role: 'COACH' | 'ALUNO'
) => {
  let user;

  if (role === 'COACH') {
    user = await prisma.coach.findUnique({ where: { email } });
  } else {
    user = await prisma.aluno.findUnique({ where: { email } });
  }

  if (!user) {
    throw new ApiError(401, 'Credenciais inválidas');
  }

  if (role === 'ALUNO') {
    const assinaturasAtivas = await prisma.assinatura.findMany({
      where: {
        alunoId: user.id,
        status: "ATIVA"
      }
    });

    if (!assinaturasAtivas.length) {
      throw new ApiError(401, 'Assinatura não ativa');
    }

    const hoje = new Date();
    const assinaturaValida = assinaturasAtivas.find(a => 
      a.dataInicio <= hoje && (!a.dataFim || a.dataFim >= hoje)
    );

    if (!assinaturaValida) {
      // Atualiza todas as assinaturas que estão fora do período válido
      await prisma.assinatura.updateMany({
        where: {
          id: { in: assinaturasAtivas.map(a => a.id) },
          OR: [
            { dataInicio: { gt: hoje } },
            { dataFim: { lt: hoje } }
          ]
        },
        data: {
          status: "CANCELADA"
        }
      });
      throw new ApiError(401, 'Assinatura expirada ou não iniciada');
    }
  }

  const isMatch = await comparePassword(password, user.senha);
  if (!isMatch) {
    throw new ApiError(401, 'Credenciais inválidas');
  }

  return user;
};