import { z } from 'zod';

export const createAssinaturaSchema = z.object({
  id: z.string().uuid('ID inválido').optional(),
  alunoId: z.string().uuid('ID do aluno inválido'),
  planoId: z.string().uuid('ID do plano inválido'),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início inválida'),
    dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de fim inválida'),
  valor: z.number().min(0, 'Valor não pode ser negativo'),
  status: z.enum(['PENDENTE_APROVACAO', 'ATIVA', 'CANCELADA', "PENDENTE"]),
  parcela: z.number(),
  total_parcelas: z.number(),
  comprovante_pagamento: z.any().optional(),
});

export const updateAssinaturaSchema = createAssinaturaSchema.partial().extend({
});


export type CreateAssinaturaInput = z.infer<typeof createAssinaturaSchema>;
export type UpdateAssinaturaInput = z.infer<typeof updateAssinaturaSchema>;