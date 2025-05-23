import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreatePlanoTreinoInput } from '../schemas/treino.schema';
import { uploadFile } from '../config/upload';
import { deleteFileFromSupabase, uploadFileToSupabase } from './supabase.service';

export const getAllPlanosTreinoService = async (userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'coach') {
    return await prisma.planoTreino.findMany({
      where: { coachId: userId },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
  } else {
    return await prisma.planoTreino.findMany({
      where: { alunoId: userId },
      include: {
        coach: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });
  }
};

export const getPlanoTreinoByIdService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const planoTreino = await prisma.planoTreino.findUnique({
    where: { id },
    include: {
      aluno: {
        select: {
          id: true,
          nome: true,
          coachId: true
        }
      },
      coach: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });

  if (!planoTreino) {
    throw new ApiError(404, 'Plano de treino não encontrado');
  }

  if (tipo === 'aluno' && planoTreino.alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach' && planoTreino.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  return planoTreino;
};

export const createPlanoTreinoService = async (input: CreatePlanoTreinoInput, file: Express.Multer.File, userId: string) => {
  const { alunoId } = input;

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    select: { coachId: true }
  });

  if (!aluno || aluno.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  const arquivoUrl = await uploadFileToSupabase(file, 'planos-treino');

  return await prisma.planoTreino.create({
    data: {
      ...input,
      coachId: userId,
      arquivo_url: arquivoUrl
    }
  });
};

export const downloadPlanoTreinoArquivoService = async (id: string) => {
  const plano = await prisma.planoTreino.findUnique({ where: { id } });

  if (!plano || !plano.arquivo_url) throw new ApiError(404, 'Arquivo não encontrado');

  // Redireciona para a URL do Supabase
  return plano.arquivo_url;
};

export const getTreinosByAlunoIdService = async (alunoId: string) => {
  return prisma.planoTreino.findMany({
    where: { alunoId },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      arquivo_url: true,
      createdAt: true,
      updatedAt: true,
      coach: { select: { id: true, nome: true } }
    }
  });
};

export const deletePlanoTreinoService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const plano = await prisma.planoTreino.findUnique({ where: { id } });

  if (!plano) {
    throw new ApiError(404, 'Plano de treino não encontrado');
  }

  if (tipo === 'coach' && plano.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'aluno' && plano.alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (plano.arquivo_url) {
    await deleteFileFromSupabase(plano.arquivo_url, 'planos-treino');
  }

  await prisma.planoTreino.delete({ where: { id } });

  return { success: true };
};