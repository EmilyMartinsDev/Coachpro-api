import { prisma } from "../../../config/database";

export interface AlunoListarDietaParams {
    alunoId: string;
    page: number;
    pageSize: number;
    dataInicio?: string
    dataFim?: string
}

export class AlunoListarDietaService {
    async execute(params: AlunoListarDietaParams) {
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
        const [total, dietas] = await Promise.all([
            prisma.planoAlimentar.count({ where }),
            prisma.planoAlimentar.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
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