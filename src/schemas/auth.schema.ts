import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  tipo: z.enum(['coach', 'aluno'])
});

export const registerCoachSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  telefone: z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone deve ter DDD e 8 ou 9 dígitos'),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida')
});

export const registerAlunoSchema = registerCoachSchema.extend({
  coachId: z.string().uuid('ID do coach inválido'),
  diaFeedback: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterCoachInput = z.infer<typeof registerCoachSchema>;
export type RegisterAlunoInput = z.infer<typeof registerAlunoSchema>;
