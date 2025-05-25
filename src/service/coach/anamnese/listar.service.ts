import { prisma } from "@/config/database";


export interface ListarAnamnesesParams {
  alunoId: string;
  search?: string;
  page?: number;
  page_size?: number;
  dataInicio?: Date;
  dataFim?: Date;
}

export class ListarAnamnesesService {
  async execute(params: ListarAnamnesesParams) {
    const {
      alunoId,
      search,
      page = 1,
      page_size = 10,
      dataInicio,
      dataFim,
    } = params;

    const where: any = {
      alunoId,
    };

    if (search) {
      where.OR = [
        { aluno: { nome: { contains: search, mode: "insensitive" } } },
        { observacoes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (dataInicio && dataFim) {
      where.createdAt = {
        gte: dataInicio,
        lte: dataFim,
      };
    }

    const total = await prisma.anamnese.count({ where });

    const anamneses = await prisma.anamnese.findMany({
      where,
      skip: (page - 1) * page_size,
      take: page_size,
      orderBy: { createdAt: "desc" },
      include: { aluno: true },
    });

    return {
      data: anamneses,
      meta: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
