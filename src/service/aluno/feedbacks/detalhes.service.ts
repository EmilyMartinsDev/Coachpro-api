import { prisma } from "@/config/database";


export class AlunoDetalhesFeedbackService {
  async execute(feedbackId: string) {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id: feedbackId,
      },
      include:{
         aluno:true,
         fotos:true
      }
    });

    if (!feedback) {
      throw new Error("Feedback não encontrado ou não autorizado.");
    }

    return feedback;
  }
}
