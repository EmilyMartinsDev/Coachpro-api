
import { prisma } from '../../../config/database';
import { uploadFileToSupabase } from '../../supabase.service';


interface AnexarTreinoParams {
  coachId: string;
  alunoId: string;
  file: Express.Multer.File;
}

export class AnexarTreinoService {
  async execute({ coachId, alunoId, file }: AnexarTreinoParams) {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno || aluno.coachId !== coachId) {
      throw new Error('Aluno não encontrado ou não pertence ao coach');
    }

   const arquivoUrl = await uploadFileToSupabase(file, "planos-treino")



    const planoTreino = await prisma.planoTreino.create({
      data: {
        titulo: file.originalname,
        arquivo_url: arquivoUrl,
        alunoId,
        coachId,
      },
    });
 
    return planoTreino;
  }
}
