import { prisma } from '@/config/database';

export class CriarAssinaturaService {
    async execute(alunoId: string, parcelamentoId: string) {
        // 1. Validação do parcelamento
        const parcelamento = await this.validarParcelamento(parcelamentoId);

        // 2. Verificar se aluno já tem assinatura ativa
        await this.verificarAssinaturasAtivas(alunoId);

        // 3. Criar assinaturas parceladas em transação
        return await this.criarAssinaturasParceladas(alunoId, parcelamentoId, parcelamento.quantidadeParcela);
    }

    private async validarParcelamento(parcelamentoId: string) {
        const parcelamento = await prisma.parcelamento.findUnique({
            where: { id: parcelamentoId },
            include: { plano: true }
        });

        if (!parcelamento) {
            throw new Error("Parcelamento não encontrado");
        }

        return parcelamento;
    }

    private async verificarAssinaturasAtivas(alunoId: string) {
        const assinaturaAtiva = await prisma.assinatura.findFirst({
            where: {
                alunoId,
                status: 'ATIVA'
            }
        });

        if (assinaturaAtiva) {
            throw new Error("Aluno já possui uma assinatura ativa");
        }
    }

    private async criarAssinaturasParceladas(alunoId: string, parcelamentoId: string, quantidadeParcelas: number) {
        return await prisma.$transaction(async (prisma) => {
            const assinaturas = [];
            
            for (let i = 0; i < quantidadeParcelas; i++) {
                const assinatura = await prisma.assinatura.create({
                    data: {
                        alunoId,
                        parcelamentoId,
                        status: "PENDENTE",
                        parcela: i + 1
                    },
                    include: {
                        parcelamento: {
                            include: {
                                plano: true
                            }
                        }
                    }
                });
                assinaturas.push(assinatura);
            }

            return assinaturas;
        });
    }
}