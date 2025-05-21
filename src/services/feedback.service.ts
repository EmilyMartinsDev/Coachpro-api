import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreateFeedbackInput, ResponderFeedbackInput } from '../schemas/feedback.schema';


export const getAllFeedbacksService = async (userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'coach') {
    return await prisma.feedback.findMany({
      where: {
        aluno: {
          coachId: userId
        }
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true
          }
        },
        fotos: true
      }
    });
  } else {
    return await prisma.feedback.findMany({
      where: {
        alunoId: userId
      },
      include: {
        fotos: true
      }
    });
  }
};

export const getFeedbackByIdService = async (id: string, userId: string, tipo: 'coach' | 'aluno') => {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: {
      aluno: {
        select: {
          id: true,
          nome: true,
          coachId: true
        }
      },
      fotos: true
    }
  });

  if (!feedback) {
    throw new ApiError(404, 'Feedback não encontrado');
  }

  if (tipo === 'aluno' && feedback.alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach' && feedback.aluno.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  return feedback;
};

export const createFeedbackService = async (input: CreateFeedbackInput, userId: string) => {
  const feedback = await prisma.feedback.create({
    data: {
      alunoId: userId,
      peso: input.peso,
      diaFeedback: input.diaFeedback,
      seguiuPlano: input.seguiuPlano,
      comeuAMais: input.comeuAMais,
      refeicoesPerdidas: input.refeicoesPerdidas,
      refeicaoLivre: input.refeicaoLivre,
      digestaoIntestino: input.digestaoIntestino,
      dificuldadeAlimentos: input.dificuldadeAlimentos,
      periodoMenstrual: input.periodoMenstrual || false,
      horasSono: input.horasSono,
      qualidadeSono: input.qualidadeSono,
      acordouCansado: input.acordouCansado || false,
      manteveProtocolo: input.manteveProtocolo,
      efeitosColaterais: input.efeitosColaterais,
      observacoes: input.observacoes,
      respondido: false,
    },
    include: {
      fotos: true
    }
  });

  return feedback;
};

export const responderFeedbackService = async (id: string, input: ResponderFeedbackInput, userId: string) => {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: {
      aluno: {
        select: {
          coachId: true
        }
      }
    }
  });

  if (!feedback) {
    throw new ApiError(404, 'Feedback não encontrado');
  }

  if (feedback.aluno.coachId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  const updatedFeedback = await prisma.feedback.update({
    where: { id },
    data: {
      respondido: true,
      respostaCoach: input.resposta
    }
  });

  return updatedFeedback;
};

export const getFeedbacksByAlunoService = async (alunoId: string, userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'aluno' && alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach') {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { coachId: true }
    });

    if (!aluno || aluno.coachId !== userId) {
      throw new ApiError(403, 'Acesso não autorizado');
    }
  }

  return await prisma.feedback.findMany({
    where: { alunoId },
    include: {
      fotos: true
    }
  });
};