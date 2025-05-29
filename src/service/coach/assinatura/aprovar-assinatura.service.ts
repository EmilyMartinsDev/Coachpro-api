import { prisma } from '@/config/database';

type StatusAssinatura = "ATIVA" | "PENDENTE" | "INATIVA" | "PENDENTE_APROVACAO" | "CANCELADA";

export class AprovarAssinaturaService {
    async execute(assinaturaId: string) {
        // Primeiro validamos se é primeira parcela ou não
        const assinatura = await prisma.assinatura.findUnique({
            where: { id: assinaturaId },
            include: { parcelamento: true }
        });

        if (!assinatura) {
            throw new Error("Assinatura não encontrada");
        }

        if (assinatura.parcela === 1) {
            return this.aprovarPrimeiraParcela(assinaturaId);
        } else {
            return this.aprovarParcelaSubsequente(assinaturaId);
        }
    }

    private async aprovarPrimeiraParcela(assinaturaId: string) {
        return await prisma.$transaction(async (prisma) => {
            // 1. Buscar e validar a assinatura
            const primeiraParcela = await prisma.assinatura.findUnique({
                where: { id: assinaturaId },
                include: { aluno: true, parcelamento: true }
            });

            if (!primeiraParcela) throw new Error("Assinatura não encontrada");
            if (primeiraParcela.parcela !== 1) throw new Error("Esta não é a primeira parcela");

            // 2. Verificar se aluno tem outras assinaturas ativas
            await this.verificarAssinaturasAtivas(primeiraParcela.alunoId);

            // 3. Definir datas para todas as parcelas
            const todasParcelas = await prisma.assinatura.findMany({
                where: {
                    parcelamentoId: primeiraParcela.parcelamentoId,
                    alunoId: primeiraParcela.alunoId
                },
                orderBy: { parcela: 'asc' }
            });

            let dataInicio = new Date();
            const resultado = [];

            for (const parcela of todasParcelas) {
                const dataFim = new Date(dataInicio);
                dataFim.setMonth(dataFim.getMonth() + 1);
                dataFim.setDate(dataFim.getDate()); // Último dia do mês

                const status = parcela.parcela === 1 ? 'ATIVA' : 'PENDENTE';

                const updated = await prisma.assinatura.update({
                    where: { id: parcela.id },
                    data: {
                        status,
                        dataInicio,
                        dataFim,
                    }
                });

                resultado.push(updated);
                dataInicio = new Date(dataFim);
                dataInicio.setDate(dataInicio.getDate() + 1); // Próximo dia
            }

            return {
                primeiraParcela: resultado[0],
                parcelasRestantes: resultado.slice(1)
            };
        });
    }

    private async aprovarParcelaSubsequente(assinaturaId: string) {
        return await prisma.$transaction(async (prisma) => {
            // 1. Buscar e validar a assinatura
            const parcelaAtual = await prisma.assinatura.findUnique({
                where: { id: assinaturaId },
                include: { aluno: true, parcelamento: true }
            });

            if (!parcelaAtual) throw new Error("Assinatura não encontrada");
            if (parcelaAtual.parcela === 1) throw new Error("Para primeira parcela use outro método");

            // 2. Verificar parcela anterior
            const parcelaAnterior = await prisma.assinatura.findFirst({
                where: {
                    alunoId: parcelaAtual.alunoId,
                    parcelamentoId: parcelaAtual.parcelamentoId,
                    parcela: parcelaAtual.parcela - 1,
                    status: 'ATIVA'
                }
            });

            if (!parcelaAnterior?.dataFim) {
                throw new Error("Parcela anterior não está ativa ou não tem data final definida");
            }

    

            // 4. Atualizar parcela atual
            return await prisma.assinatura.update({
                where: { id: assinaturaId },
                data: {
                    status: 'ATIVA',
                    
                }
            });
        });
    }

    private async verificarAssinaturasAtivas(alunoId: string) {
        const assinaturaAtiva = await prisma.assinatura.findFirst({
            where: {
                alunoId,
                status: 'ATIVA'
            }
        });

        if (assinaturaAtiva) {
            throw new Error("Aluno já possui uma assinatura ativa em outro plano");
        }
    }
}