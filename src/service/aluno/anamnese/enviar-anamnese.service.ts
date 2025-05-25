// src/services/aluno/anamnese/enviar-anamnese.service.ts
import { prisma } from '../../../config/database';


export interface ICreateAnamneseInput{
  alunoId: string;
  nomeCompleto: string;
  instagram: string;
  email: string;
  cpf: string;
  endereco: string;
  dataNascimento: Date;
  dataPreenchimento: Date;
  altura: string;
  peso: string;
  medidaCintura?: string | null;
  medidaAbdomen?: string | null;
  medidaQuadril?: string | null;
  possuiExames: boolean;
  rotina: string;
  objetivos: string;
  tempoTreino: string;
  modalidade: string;
  divisaoTreino: string;
  cardio: string;
  alimentacaoDiaria: string;
  alimentosPreferidos: string;
  intolerancias?: string | null;
  qtdRefeicoes: string;
  horariosFome?: string | null;
  suplementos?: string | null;
  anabolizantes?: string | null;
  lesoes?: string | null;
  problemasSaude?: string | null;
  evolucaoRecente: string;
  dificuldades: string;
}

export class AlunoEnviarAnamneseService {
  async execute(data: ICreateAnamneseInput) {
    const anamneseCriada = await prisma.anamnese.create({
      data:{
        ...data
      }
    })
    return anamneseCriada
  }
  
}
