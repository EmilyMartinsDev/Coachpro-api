import { z } from 'zod';

export const updateAlunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  telefone: z.string().min(10, 'Telefone inválido').optional()
});

export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>;
