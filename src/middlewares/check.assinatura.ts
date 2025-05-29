import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../utils/apiError';
import { prisma } from '@/config/database';

export const checkSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, role } = (req as any).user;
    const today = new Date();

    // Se não for aluno, passa direto
    if (role !== 'ALUNO') return next();

    // Busca a assinatura mais recente do aluno
    const subscription = await prisma.assinatura.findFirst({
      where: { alunoId: id , status:"ATIVA"},
      orderBy: { dataInicio: 'desc' }, // Pega a mais recente
    });

    // Se não existir assinatura, bloqueia
    if (!subscription) {
      throw new ApiError(403, 'Acesso negado: nenhuma assinatura encontrada');
    }

    // Verifica se a assinatura está ativa e dentro do prazo
    const isActive =
      subscription.dataInicio <= today &&
      (subscription.dataFim === null || subscription.dataFim >= today);

    // Se estiver expirada, atualiza para CANCELADA
    if (
      subscription.status === 'ATIVA' &&
      subscription.dataFim &&
      subscription.dataFim < today
    ) {
      await prisma.assinatura.update({
        where: { id: subscription.id },
        data: { status: 'CANCELADA' },
      });
      throw new ApiError(403, 'Acesso negado: assinatura expirada');
    }

    // Se não estiver ativa, bloqueia
    if (!isActive) {
      throw new ApiError(403, 'Acesso negado: assinatura não ativa');
    }

    next();
  } catch (error) {
    next(error);
  }
};