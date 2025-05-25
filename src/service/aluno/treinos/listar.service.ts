import { prisma } from "../../../config/database";

export interface AlunoListarTreinosParams {
    alunoId: string;
    page: number;
    pageSize: number;
    dataInicio?: string
    dataFim?: string
}

export class AlunoListarTreinosService {
    async execute(params: AlunoListarTreinosParams) {
        const { alunoId, page, pageSize } = params;

        const where: any = { alunoId };
        if (params.dataInicio || params.dataFim) {
            where.createdAt = {};
            if (params.dataInicio) {
                where.createdAt.gte = new Date(params.dataInicio);
            }
            if (params.dataFim) {
                where.createdAt.lte = new Date(params.dataFim);
            }
        }
        const [total, treinos] = await Promise.all([
            prisma.planoTreino.count({ where }),
            prisma.planoTreino.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
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