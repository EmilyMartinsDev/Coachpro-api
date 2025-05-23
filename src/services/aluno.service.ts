import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { UpdateAlunoInput } from '../schemas/aluno.schema';


export const getAlunoService = async (userId:string) => {


  return await prisma.aluno.findFirst({
    where: { id:userId },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      createdAt: true
    }
  });
};

export const getAlunoByIdService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const aluno = await prisma.aluno.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      diaFeedback: true,
      coachId: true,
      coach: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      },
      feedbacks: true,
      assinaturas: true,
      planosAlimentar: true,
      planosTreino: true,
      createdAt: true,
      anamnese:true
    }
  });

  if (!aluno) {
    throw new ApiError(404, 'Aluno não encontrado');
  }

  if (tipo === 'aluno' && aluno.id !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach' && aluno.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  return aluno;
};

export const getAlunosByCoachService = async (coachId: string, userId: string, tipo: 'coach' | 'aluno', options?:any) => {
  if (tipo === 'coach' && coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  return await prisma.aluno.findMany({
    where: { coachId },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      createdAt: true
    }
  });
};

export const updateAlunoService = async (id: string, input: UpdateAlunoInput, userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'aluno' && id !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  const aluno = await prisma.aluno.update({
    where: { id },
    data: {
      nome: input.nome,
      telefone: input.telefone
    },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      coachId: true,
      createdAt: true
    }
  });

  return aluno;
};