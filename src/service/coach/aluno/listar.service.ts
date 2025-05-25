import { prisma } from "../../../config/database";

export interface ListarAlunosParams {
  coachId: string;
  search?: string;
  dataNascimento?: string;
  page: number;
  pageSize: number;
  orderBy: 'nome' | 'email' | 'createdAt';
  order: 'asc' | 'desc';
}

export class ListarAlunosService {
  async execute(params: ListarAlunosParams) {
    const { coachId, search, dataNascimento, page, pageSize, orderBy, order } = params;

    const where: any = { coachId };

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dataNascimento) {
      where.dataNascimento = dataNascimento;
    }

    const [total, alunos] = await Promise.all([
      prisma.aluno.count({ where }),
      prisma.aluno.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          dataNascimento: true,
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      data: alunos,
    };
  }
}