import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { CreateAnamneseInput } from '../schemas/anamnese.schema';

export const getAnamneseByAlunoService = async (alunoId: string, userId: string, tipo: 'coach' | 'aluno') => {
  if (tipo === 'aluno' && alunoId !== userId) {
    throw new ApiError(403, 'Acesso não autorizado');
  }

  if (tipo === 'coach') {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { coachId: true }
    });

    if (!aluno || aluno.coachId !== userId) {
      throw new ApiError(403, 'Acesso não autorizado');
    }
  }

  const anamnese = await prisma.anamnese.findUnique({
    where: { alunoId }
  });

  if (!anamnese) {
    throw new ApiError(404, 'Anamnese não encontrada');
  }

  return anamnese;
};

export const createAnamneseService = async (input: CreateAnamneseInput, userId: string) => {
  const existingAnamnese = await prisma.anamnese.findUnique({
    where: { alunoId: userId }
  });

  if (existingAnamnese) {
    throw new ApiError(400, 'Anamnese já existe para este aluno');
  }

  return await prisma.anamnese.create({
    data: {
      alunoId: userId,
      nomeCompleto: input.nomeCompleto,
      instagram: input.instagram || "",
      email: input.email,
      cpf: input.cpf,
      endereco: input.endereco,
      dataNascimento: new Date(input.dataNascimento),
      dataPreenchimento: new Date(),
      altura: input.altura,
      peso: input.peso,
      medidaCintura: input.medidaCintura,
      medidaAbdomen: input.medidaAbdomen,
      medidaQuadril: input.medidaQuadril,
      possuiExames: input.possuiExames,
      rotina: input.rotina,
      objetivos: input.objetivos,
      tempoTreino: input.tempoTreino,
      modalidade: input.modalidade,
      divisaoTreino: input.divisaoTreino,
      cardio: input.cardio,
      alimentacaoDiaria: input.alimentacaoDiaria,
      alimentosPreferidos: input.alimentosPreferidos,
      intolerancias: input.intolerancias,
      qtdRefeicoes: input.qtdRefeicoes,
      horariosFome: input.horariosFome,
      suplementos: input.suplementos,
      anabolizantes: input.anabolizantes,
      lesoes: input.lesoes,
      problemasSaude: input.problemasSaude,
      evolucaoRecente: input.evolucaoRecente,
      dificuldades: input.dificuldades
    }
  });
};