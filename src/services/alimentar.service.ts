import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreatePlanoAlimentarInput } from '../schemas/alimentar.schema';
import { uploadFile } from '../config/upload';
import { deleteFileFromSupabase, uploadFileToSupabase } from './supabase.service';

export const getAllPlanosAlimentaresService = async (userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'coach') {
    return await prisma.planoAlimentar.findMany({
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
    return await prisma.planoAlimentar.findMany({
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

export const getPlanoAlimentarByIdService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const planoAlimentar = await prisma.planoAlimentar.findUnique({
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

  if (!planoAlimentar) {
    throw new ApiError(404, 'Plano alimentar não encontrado');
  }

  if (tipo === 'aluno' && planoAlimentar.alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach' && planoAlimentar.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  return planoAlimentar;
};

export const createPlanoAlimentarService = async (input: CreatePlanoAlimentarInput, file: Express.Multer.File, userId: string) => {
  const { alunoId } = input;

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    select: { coachId: true }
  });

  if (!aluno || aluno.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  const arquivoUrl = await uploadFileToSupabase(file, 'planos-alimentares');

  return await prisma.planoAlimentar.create({
    data: {
      ...input,
      coachId: userId,
      arquivo_url: arquivoUrl
    }
  });
};

export const downloadPlanoAlimentarArquivoService = async (id: string) => {
  const plano = await prisma.planoAlimentar.findUnique({ where: { id } });

  if (!plano || !plano.arquivo_url) throw new ApiError(404, 'Arquivo não encontrado');

  // Redireciona para a URL do Supabase
  return plano.arquivo_url;

}

export const deletePlanoAlimentarService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const plano = await prisma.planoAlimentar.findUnique({ where: { id } });

  if (!plano) {
    throw new ApiError(404, 'Plano alimentar não encontrado');
  }

  if (tipo === 'coach' && plano.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'aluno' && plano.alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (plano.arquivo_url) {
    await deleteFileFromSupabase(plano.arquivo_url, 'planos-alimentares');
  }

  await prisma.planoAlimentar.delete({ where: { id } });

  return { success: true };
};