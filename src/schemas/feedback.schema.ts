import { z } from 'zod';

export const createFeedbackSchema = z.object({
  peso: z.string().optional(),
  diaFeedback: z.string(),
  seguiuPlano: z.enum(['TOTALMENTE', 'PARCIALMENTE', 'NAO']),
  comeuAMais: z.string().optional(),
  refeicoesPerdidas: z.string().optional(),
  refeicaoLivre: z.string().optional(),
  digestaoIntestino: z.string().optional(),
  dificuldadeAlimentos: z.string().optional(),
  periodoMenstrual: z.boolean().optional(),
  horasSono: z.string().optional(),
  qualidadeSono: z.enum(['OTIMA', 'BOA', 'REGULAR', 'RUIM', 'PESSIMA']),
  acordouCansado: z.boolean().optional(),
  manteveProtocolo: z.enum(['TOTALMENTE', 'PARCIALMENTE', 'NAO']),
  efeitosColaterais: z.string().optional(),
  observacoes: z.string().optional()
});

export const responderFeedbackSchema = z.object({
  resposta: z.string().min(1, 'Resposta não pode ser vazia')
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type ResponderFeedbackInput = z.infer<typeof responderFeedbackSchema>;
