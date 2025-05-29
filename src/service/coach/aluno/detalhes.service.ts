import { prisma } from "../../../config/database";


export class DetalhesAlunoService {
  async execute(id: string) {
    try {
      const aluno = await prisma.aluno.findUnique({
        where: { id },
        
          include:{
          assinaturas:{
            include:{
              parcelamento:{
                include:{
                  plano:true
                }
              }
            }
          },
          feedbacks:true,
          planosAlimentar:true,
          planosTreino:true
        },
        
      });
      if (!aluno) throw new Error('Aluno não encontrado.');
      return aluno;
    } catch (error) {
      throw new Error('Erro ao obter detalhes do aluno.');
    }
  }
}
