import { authenticateUser, generateToken, hashPassword } from "@/config/auth";
import { prisma } from "@/config/database";
import { ApiError } from "@/utils/apiError";

type LoginInput = {
  email: string
  senha: string
  role: "COACH" | "ALUNO"
}

type RegisterCoachInput = {
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  dataNascimento: string
}
type RegisterAlunoInput = {
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  dataNascimento: string
  coachId:string
  diaFeedback:string
}
export const login = async (input: LoginInput) => {
  const { email, senha, role } = input;

  const user = await authenticateUser(email, senha, role);
  const token = generateToken(user.id, role);
  
  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role
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

  const token = generateToken(coach.id, 'COACH');

  return {
    id: coach.id,
    nome: coach.nome,
    email: coach.email,
    role: 'COACH',
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

  const token = generateToken(aluno.id, 'ALUNO');

  return {
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    role: 'ALUNO',
    token
  };
};
