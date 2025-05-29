import { prisma } from "@/config/database";


export interface ListarAnamnesesParams {
  alunoId?: string;
  search?: string;
  page?: number;
  page_size?: number;
  dataInicio?: Date;
  dataFim?: Date;
  analisado?: boolean
  coachId: string
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
      analisado,
      coachId
    } = params;

    const where: any = {
      aluno: {
        coachId
      },
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
    if (typeof analisado === 'boolean') {
      where.AND = [];

      if (analisado == true) {
        // Só pega se o aluno tiver plano alimentar ou de treino
        where.AND.push({
          OR: [
            { aluno: { planosAlimentar: { some: {} } } },
            { aluno: { planosTreino: { some: {} } } },
          ]
        });
      } else if(analisado == false) {
        // Só pega se o aluno NÃO tiver nem plano alimentar nem de treino
        where.AND.push({
          AND: [
            { aluno: { planosAlimentar: { none: {} } } },
            { aluno: { planosTreino: { none: {} } } },
          ]
        });
      }
    }

    const total = await prisma.anamnese.count({ where });

    const anamneses = await prisma.anamnese.findMany({
      where,
      skip: (page - 1) * page_size,
      take: page_size,
      orderBy: { createdAt: "desc" },
      include: { aluno: { include: { planosAlimentar: { select: { id: true } }, planosTreino: { select: { id: true } } } } },
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
