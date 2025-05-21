import { z } from 'zod';

export const createAnamneseSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  instagram: z.string().optional(),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  endereco: z.string().min(5, 'Endereço inválido'),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida'),
  altura: z.string().min(2, 'Altura inválida'),
  peso: z.string().min(2, 'Peso inválido'),
  medidaCintura: z.string().optional(),
  medidaAbdomen: z.string().optional(),
  medidaQuadril: z.string().optional(),
  possuiExames: z.boolean(),
  rotina: z.string().min(10, 'Rotina deve ter no mínimo 10 caracteres'),
  objetivos: z.string().min(10, 'Objetivos deve ter no mínimo 10 caracteres'),
  tempoTreino: z.string().min(3, 'Tempo de treino inválido'),
  modalidade: z.string().min(3, 'Modalidade inválida'),
  divisaoTreino: z.string().min(3, 'Divisão de treino inválida'),
  cardio: z.string().min(1, 'Cardio inválido'),
  alimentacaoDiaria: z.string().min(10, 'Alimentação diária deve ter no mínimo 10 caracteres'),
  alimentosPreferidos: z.string().min(5, 'Alimentos preferidos deve ter no mínimo 5 caracteres'),
  intolerancias: z.string().optional(),
  qtdRefeicoes: z.string().min(1, 'Quantidade de refeições inválida'),
  horariosFome: z.string().optional(),
  suplementos: z.string().optional(),
  anabolizantes: z.string().optional(),
  lesoes: z.string().optional(),
  problemasSaude: z.string().optional(),
  evolucaoRecente: z.string().min(10, 'Evolução recente deve ter no mínimo 10 caracteres'),
  dificuldades: z.string().min(10, 'Dificuldades deve ter no mínimo 10 caracteres')
});

export type CreateAnamneseInput = z.infer<typeof createAnamneseSchema>;
