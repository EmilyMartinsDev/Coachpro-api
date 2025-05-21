import { z } from 'zod';

export const createPlanoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  valor: z.number().min(0, 'Valor não pode ser negativo'),
  duracao: z.number().min(1, 'Duração deve ser pelo menos 1 mês')
});

export const updatePlanoSchema = createPlanoSchema.partial();

export type CreatePlanoInput = z.infer<typeof createPlanoSchema>;
export type UpdatePlanoInput = z.infer<typeof updatePlanoSchema>;
