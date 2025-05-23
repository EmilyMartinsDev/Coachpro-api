import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { UpdateCoachInput } from '../schemas/coach.schema';

export const getAllCoachesService = async () => {
  return await prisma.coach.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      foto: true,
      createdAt: true
    }
  });
};

export const getCoachByIdService = async (id: string) => {
  const coach = await prisma.coach.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      foto: true,
      createdAt: true,
      planos: true,
      alunos: {
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          dataNascimento: true,
          createdAt: true,
          anamnese: true,
          feedbacks: {
            include:{
fotos:true
            }
          },
          planosAlimentar: true,
          planosTreino: true,
          assinaturas: true,
        }
      }
    }
  });

  if (!coach) {
    throw new ApiError(404, 'Coach não encontrado');
  }

  return coach;
};

export const updateCoachService = async (id: string, input: UpdateCoachInput) => {
  const coach = await prisma.coach.update({
    where: { id },
    data: {
      nome: input.nome,
      telefone: input.telefone,
      foto: input.foto
    },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      foto: true,
      createdAt: true
    }
  });

  return coach;
};