import { prisma } from "../../../config/database";

export interface AlunoListarTreinosParams {
  alunoId: string;
  page?: number;
  pageSize?: number;
  dataInicio?: string;
  dataFim?: string;
}

export class AlunoListarTreinosService {
  async execute(params: AlunoListarTreinosParams) {
    const {
      alunoId,
      page = 1,
      pageSize = 10,
      dataInicio,
      dataFim
    } = params;

    const where: any = { alunoId };

    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) {
        where.createdAt.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.createdAt.lte = new Date(dataFim);
      }
    }

    const skip = Math.max(0, (page - 1) * pageSize);
    const take = Math.max(1, pageSize); // sempre pelo menos 1

    const [total, treinos] = await Promise.all([
      prisma.planoTreino.count({ where }),
      prisma.planoTreino.findMany({
        where,
        skip,
        take,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      data: treinos,
    };
  }
}
