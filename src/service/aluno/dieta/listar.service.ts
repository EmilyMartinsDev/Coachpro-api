import { prisma } from "../../../config/database";
import { Prisma } from "@prisma/client";

export interface AlunoListarDietaParams {
  alunoId: string;
  page?: number;
  pageSize?: number;
  dataInicio?: string;
  dataFim?: string;
}

export class AlunoListarDietaService {
  async execute(params: AlunoListarDietaParams) {
    const {
      alunoId,
      page = 1,
      pageSize = 10,
      dataInicio,
      dataFim
    } = params;

    const where: Prisma.PlanoAlimentarWhereInput = { alunoId };

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
    const take = Math.max(1, pageSize);

    const [total, dietas] = await Promise.all([
      prisma.planoAlimentar.count({ where }),
      prisma.planoAlimentar.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' } // ✅ Boa prática: sempre ordenar paginações.
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      data: dietas,
    };
  }
}
