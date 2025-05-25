import { prisma } from "@/config/database";


export class DetalhesFeedbackService {
  async execute(feedbackId: string) {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id: feedbackId,
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            planosAlimentar: true,
            planosTreino: true
          }
        },
        fotos: true
      }
    });

    if (!feedback) {
      throw new Error("Feedback não encontrado ou não autorizado.");
    }

    return feedback;
  }
}
