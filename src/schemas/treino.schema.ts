import { z } from 'zod';

export const createPlanoTreinoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  alunoId: z.string().uuid('ID do aluno inválido')
});

export type CreatePlanoTreinoInput = z.infer<typeof createPlanoTreinoSchema>;
