import { prisma } from '../config/database';
import { hashPassword, generateToken, authenticateUser } from '../config/auth';
import { ApiError } from '../utils/apiError';
import { LoginInput, RegisterCoachInput, RegisterAlunoInput } from '../schemas/auth.schema';

export const login = async (input: LoginInput) => {
  const { email, senha, tipo } = input;
  
  const user = await authenticateUser(email, senha, tipo);
  const token = generateToken(user.id, tipo);

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo
    }
  };
};

export const registerCoach = async (input: RegisterCoachInput) => {
  const { email } = input;
  
  const existingCoach = await prisma.coach.findUnique({ where: { email } });
  if (existingCoach) {
    throw new ApiError(400, 'Email já cadastrado');
  }

  const hashedPassword = await hashPassword(input.senha);

  const coach = await prisma.coach.create({
    data: {
      nome: input.nome,
      email,
      senha: hashedPassword,
      telefone: input.telefone,
      dataNascimento: new Date(input.dataNascimento)
    }
  });

  const token = generateToken(coach.id, 'coach');

  return {
    id: coach.id,
    nome: coach.nome,
    email: coach.email,
    tipo: 'coach',
    token
  };
};

export const registerAluno = async (input: RegisterAlunoInput) => {
  const { email, coachId } = input;
  
  const existingAluno = await prisma.aluno.findUnique({ where: { email } });
  if (existingAluno) {
    throw new ApiError(400, 'Email já cadastrado');
  }

  const coachExists = await prisma.coach.findUnique({ where: { id: coachId } });
  if (!coachExists) {
    throw new ApiError(404, 'Coach não encontrado');
  }

  const hashedPassword = await hashPassword(input.senha);

  const aluno = await prisma.aluno.create({
    data: {
      nome: input.nome,
      email,
      senha: hashedPassword,
      telefone: input.telefone,
      dataNascimento: new Date(input.dataNascimento),
      coachId,
      diaFeedback: input.diaFeedback,
    }
  });

  const token = generateToken(aluno.id, 'aluno');

  return {
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    tipo: 'aluno',
    token
  };
};
