import { prisma } from "@/config/database";

export type PlanoStatus = 'SIM' | 'NAO' | 'PARCIAL';
export type QualidadeSono = 'RUIM' | 'MEDIA' | 'BOA' | 'EXCELENTE';
export interface FotoFeedback {
  id: string;
  feedbackId: string;
  url: string;
  createdAt: Date;
}



export interface AlunofeedbackInputDto {
  alunoId: string;
  peso?: string | null;
  diaFeedback: string;
  seguiuPlano: any;
  comeuAMais?: string | null;
  refeicoesPerdidas?: string | null;
  refeicaoLivre?: string | null;
  digestaoIntestino?: string | null;
  dificuldadeAlimentos?: string | null;
  periodoMenstrual: boolean;
  horasSono?: string | null;
  qualidadeSono: any;
  acordouCansado: boolean;
  manteveProtocolo: any;
  efeitosColaterais?: string | null;
  observacoes?: string | null;
}

export class AlunoEnviarFeedbackService{
    async execute({acordouCansado, alunoId, diaFeedback, manteveProtocolo, periodoMenstrual, qualidadeSono, seguiuPlano, comeuAMais,dificuldadeAlimentos, digestaoIntestino,
         efeitosColaterais, horasSono, observacoes, peso, refeicaoLivre,
    }:AlunofeedbackInputDto){
        return await prisma.feedback.create({
            data: {
                acordouCansado,
                diaFeedback,
                manteveProtocolo,
                periodoMenstrual,
                qualidadeSono,
                seguiuPlano,
                comeuAMais,
                alunoId,
                peso: String(peso),
                horasSono,
                observacoes,
                refeicaoLivre,
                efeitosColaterais,
                digestaoIntestino,
                dificuldadeAlimentos
            }
        })
    }
}