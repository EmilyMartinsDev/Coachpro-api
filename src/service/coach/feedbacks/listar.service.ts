import { prisma } from "@/config/database";

export interface ListarFeedbacksParams {
  alunoId?: string;
  page?: number;
  pageSize?: number;
  respondido?: boolean;
  dataInicio?: string;
  dataFim?: string;
  coachId: string;
  search?: string;
}

export class ListarFeedbacksService {
  async execute({
    coachId,
    alunoId,
    page = 1,
    pageSize = 10,
    respondido,
    dataFim,
    dataInicio,
    search
  }: ListarFeedbacksParams) {
    const where: any = { aluno: { coachId } };

    if (search) {
      where.OR = [
        { aluno: { nome: { contains: search, mode: "insensitive" } } },
        { aluno: { email: { contains: search, mode: "insensitive" } } }
      ];
    }

    if (alunoId) {
      where.alunoId = alunoId;
    }

    if (respondido !== undefined) {
      where.respondido = respondido;
    }

    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) {
        where.createdAt.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.createdAt.lte = new Date(dataFim);
      }
    }

    const [total, feedbacks] = await Promise.all([
      prisma.feedback.count({ where }),
      prisma.feedback.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include:{
          aluno:{
            select:{
              nome:true
            }
          }
        }
      })
    ]);

    return {
      total,
      page,
      pageSize,
      data: feedbacks
    };
  }
}
