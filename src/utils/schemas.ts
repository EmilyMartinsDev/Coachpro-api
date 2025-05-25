import { z } from 'zod';
import { StatusAssinatura, PlanoStatus, QualidadeSono } from '@prisma/client';

// Schemas comuns
export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(6);
export const PhoneSchema = z.string().min(10).max(15);

// Coach
export const CoachSchema = z.object({
  nome: z.string().min(3),
  email: EmailSchema,
  senha: PasswordSchema,
  telefone: PhoneSchema,
  dataNascimento: z.date(),
  foto: z.string().optional(),
});

// Aluno
export const AlunoSchema = z.object({
  nome: z.string().min(3),
  email: EmailSchema,
  senha: PasswordSchema,
  telefone: PhoneSchema,
  dataNascimento: z.date(),
  diaFeedback: z.string(),
  coachId: IdSchema,
});

// Plano
export const PlanoSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
  valor: z.number().positive(),
  duracao: z.number().int().positive(),
  coachId: IdSchema,
});

// Assinatura
export const AssinaturaSchema = z.object({
  alunoId: IdSchema,
  planoId: IdSchema,
  status: z.nativeEnum(StatusAssinatura),
  dataInicio: z.date(),
  dataFim: z.date(),
  valor: z.number().positive(),
  parcela: z.number().int().nonnegative(),
  totalParcelas: z.number().int().positive(),
  comprovante_url: z.string().optional(),
});

// PlanoTreino
export const PlanoTreinoSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
  arquivo_url: z.string().optional(),
  alunoId: IdSchema,
  coachId: IdSchema,
});

// PlanoAlimentar
export const PlanoAlimentarSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().optional(),
  arquivo_url: z.string().optional(),
  alunoId: IdSchema,
  coachId: IdSchema,
});

// Feedback
export const FeedbackSchema = z.object({
  alunoId: IdSchema,
  peso: z.string().optional(),
  diaFeedback: z.string(),
  seguiuPlano: z.nativeEnum(PlanoStatus),
  comeuAMais: z.string().optional(),
  refeicoesPerdidas: z.string().optional(),
  refeicaoLivre: z.string().optional(),
  digestaoIntestino: z.string().optional(),
  dificuldadeAlimentos: z.string().optional(),
  periodoMenstrual: z.boolean(),
  horasSono: z.string().optional(),
  qualidadeSono: z.nativeEnum(QualidadeSono),
  acordouCansado: z.boolean(),
  manteveProtocolo: z.nativeEnum(PlanoStatus),
  efeitosColaterais: z.string().optional(),
  observacoes: z.string().optional(),
  respondido: z.boolean().optional(),
  respostaCoach: z.string().optional(),
});

// FotoFeedback
export const FotoFeedbackSchema = z.object({
  feedbackId: IdSchema,
  url: z.string().optional(),
});

// Anamnese
export const AnamneseSchema = z.object({
  alunoId: IdSchema,
  nomeCompleto: z.string().min(3),
  instagram: z.string().optional(),
  email: EmailSchema,
  cpf: z.string().length(11),
  endereco: z.string(),
  dataNascimento: z.date(),
  dataPreenchimento: z.date(),
  altura: z.string(),
  peso: z.string(),
  medidaCintura: z.string().optional(),
  medidaAbdomen: z.string().optional(),
  medidaQuadril: z.string().optional(),
  possuiExames: z.boolean(),
  rotina: z.string(),
  objetivos: z.string(),
  tempoTreino: z.string(),
  modalidade: z.string(),
  divisaoTreino: z.string(),
  cardio: z.string(),
  alimentacaoDiaria: z.string(),
  alimentosPreferidos: z.string(),
  intolerancias: z.string().optional(),
  qtdRefeicoes: z.string(),
  horariosFome: z.string().optional(),
  suplementos: z.string().optional(),
  anabolizantes: z.string().optional(),
  lesoes: z.string().optional(),
  problemasSaude: z.string().optional(),
  evolucaoRecente: z.string(),
  dificuldades: z.string(),
});