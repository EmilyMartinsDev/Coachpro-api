import { prisma } from "@/config/database";


export interface AlunoListarFeedbacksParams {
    alunoId?: string;
    page?: number;
    pageSize?: number;
    respondido?: boolean;
    dataInicio?: string;
    dataFim?: string;
}

export class AlunoListarFeedbacksService {
    async execute({ alunoId, page = 1, pageSize = 10, respondido, dataFim, dataInicio }: AlunoListarFeedbacksParams) {
        const where: any = { alunoId };

        if (alunoId) {
            where.alunoId = alunoId;
        }
        if (respondido) {
            where.respondido = respondido
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
            }),
        ]);

        return {
            total,
            page,
            pageSize,
            data: feedbacks
        };
    }
}
