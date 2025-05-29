// src/service/coach/plano/criar-plano.service.ts
import { prisma } from '@/config/database';

export interface CreatePlanoInputDto {
  coachId: string;
  titulo: string;
  descricao?: string;
  parcelamentos?: {
    valorParcela: number;
    quantidadeParcela: number;
  }[];

}

export class CriarPlanoService {
  async execute({
    coachId,
    titulo,
    descricao,
    parcelamentos = [], // Parcelamentos opcionais
  }: CreatePlanoInputDto) {
    // Usa transação para garantir atomicidade
    return await prisma.$transaction(async (prisma) => {
      // 1. Cria o plano
      const plano = await prisma.plano.create({
        data: {
          titulo,
          coachId,
          descricao,
        },
      });

      // 2. Cria os parcelamentos (se existirem)
      if (parcelamentos.length > 0) {
        await prisma.parcelamento.createMany({
          data: parcelamentos.map((parcela) => ({
            planoId: plano.id,
            valorParcela: parcela.valorParcela,
            quantidadeParcela: parcela.quantidadeParcela,
          })),
        });
      }

      return plano;
    });
  }
}