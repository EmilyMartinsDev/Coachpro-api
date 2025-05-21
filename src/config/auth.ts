import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { ApiError } from '../utils/apiError';
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;

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

// Função utilitária para converter expiresIn para o tipo aceito pelo jsonwebtoken
function parseExpiresIn(val: string | undefined): number | undefined {
  if (!val) return undefined;
  // Se for número, retorna como número
  if (!isNaN(Number(val))) return Number(val);
  // Se for string tipo '7d', '1h', retorna como está
  return val as any;
}

export const generateToken = (userId: string, tipo: 'coach' | 'aluno'): string => {
  const expiresIn = parseExpiresIn(JWT_EXPIRES_IN);
  const secret: string = JWT_SECRET || 'seu_segredo_jwt';
  return jwt.sign({ id: userId, tipo }, secret, expiresIn ? { expiresIn } : undefined);
};

export const verifyToken = (token: string): { id: string; tipo: 'coach' | 'aluno' } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; tipo: 'coach' | 'aluno' };
};

export const authenticateUser = async (
  email: string,
  password: string,
  tipo: 'coach' | 'aluno'
) => {
  let user;
  
  if (tipo === 'coach') {
    user = await prisma.coach.findUnique({ where: { email } });
  } else {
    user = await prisma.aluno.findUnique({ where: { email } });
  }

  if (!user) {
    throw new ApiError(401, 'Credenciais inválidas');
  }

  const isMatch = await comparePassword(password, user.senha);
  if (!isMatch) {
    throw new ApiError(401, 'Credenciais inválidas');
  }

  return user;
};
