import { z } from 'zod';

export const updateCoachSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  telefone: z.string().min(10, 'Telefone inválido').optional(),
  foto: z.string().url('URL inválida').optional()
});

export type UpdateCoachInput = z.infer<typeof updateCoachSchema>;
