import { prisma } from "@/config/database";


export interface ListAssinaturasParams {
  coachId: string;
  page?: number;
  pageSize?: number;
  status?: "PENDENTE" | "APROVADA" | "CANCELADA";
  alunoId?: string;
  search?: string;
}

export class ListAssinaturasService {
  async execute({ coachId, page = 1, pageSize = 10, status, alunoId, search }: ListAssinaturasParams) {
    const where: any = {
      aluno:{
        coachId
      },
    };

    if (status) {
      where.status = status;
    }

    if (alunoId) {
      where.alunoId = alunoId;
    }

    if (search) {
      where.aluno = {
        nome: {
          contains: search,
          mode: "insensitive"
        }
      };
    }

    const [total, assinaturas] = await Promise.all([
      prisma.assinatura.count({ where }),
      prisma.assinatura.findMany({
        where,
        include: {
          aluno: true,
          parcelamento: {
            include:{
              plano:true
            }
          },
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
