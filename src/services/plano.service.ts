import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreatePlanoInput, UpdatePlanoInput } from '../schemas/plano.schema';

export const getAllPlanosService = async (userId:string, tipo:string) => {

  if(tipo == "coach"){
  return await prisma.plano.findMany({
    where:{
      coachId: userId,
    },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      valor: true,
      duracao: true,
      createdAt: true
    }
  });
  }
  const aluno = await prisma.aluno.findFirst({
    where:{
      id: userId
    },
    select:{
      coachId:true
    }
  })


  if(!aluno){
    throw new Error("Plano não encontrado para esse coach desse aluno")
  }

    return await prisma.plano.findMany({
    where:{
      coachId: aluno.coachId
    },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      valor: true,
      duracao: true,
      createdAt: true
    }
  });


};

export const createPlanoService = async (input: CreatePlanoInput) => {
  return await prisma.plano.create({
    data: {
      titulo: input.titulo,
      descricao: input.descricao,
      valor: input.valor,
      duracao: input.duracao,
      coachId: input.coachId
    },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      valor: true,
      duracao: true,
      createdAt: true
    }
  });
};

export const updatePlanoService = async (id: string, input: UpdatePlanoInput, ) => {
  return await prisma.plano.update({
    where: { id },
    data: {
      titulo: input.titulo,
      descricao: input.descricao,
      valor: input.valor,
      duracao: input.duracao
    },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      valor: true,
      duracao: true,
      createdAt: true
    }
  });
};

export const getPlanoByIdService = async (id: string) => {
  const plano = await prisma.plano.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      valor: true,
      duracao: true,
      createdAt: true
    }
  });
  if (!plano) {
    throw new ApiError(404, 'Plano não encontrado');
  }
  return plano;
};

export const deletePlanoService = async (id: string) => {
  await prisma.plano.delete({
    where: { id }
  });
};