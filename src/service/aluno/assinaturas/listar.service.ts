import { prisma } from "@/config/database";


export interface AlunoListAssinaturasParams {
  page?: number;
  pageSize?: number;
 status?: "PENDENTE" | "PENDENTE_APROVACAO" | "CANCELADA" | "ATIVA";
  alunoId?: string;
}

export class AlunoListAssinaturasService {
  async execute({ page = 1, pageSize = 10, status, alunoId }: AlunoListAssinaturasParams) {
    const where: any = {
      alunoId,
    };

    if (status) {
      where.status = status;
    }

    const [total, assinaturas] = await Promise.all([
      prisma.assinatura.count({ where }),
      prisma.assinatura.findMany({
        where,
        include: {
          aluno: true,
          parcelamento: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      data: assinaturas
    };
  }
}
