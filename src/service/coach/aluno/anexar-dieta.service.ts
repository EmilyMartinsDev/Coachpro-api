

import { prisma } from '../../../config/database';
import { uploadFileToSupabase } from '../../supabase.service';


interface AnexarDietaParams {
  coachId: string;
  alunoId: string;
  file: Express.Multer.File;
}


export class AnexarDietaService {
  async execute({ coachId, alunoId, file }: AnexarDietaParams) {

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno || aluno.coachId !== coachId) {
      throw new Error('Aluno não encontrado ou não pertence ao coach');
    }

   const arquivoUrl = await uploadFileToSupabase(file, "planos-alimentares")

    const planoAlimentar = await prisma.planoAlimentar.create({
      data: {
        titulo: file.originalname,
        arquivo_url: arquivoUrl,
        alunoId,
        coachId,
      },
    });

    return planoAlimentar;
  }
}
