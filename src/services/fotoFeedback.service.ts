import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';

export const createFotoFeedbackService = async (feedbackId: string, file: Express.Multer.File) => {
  // Verifica se o feedback existe
  const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
  if (!feedback) throw new ApiError(404, 'Feedback não encontrado');

  // Cria a foto armazenando o binário
  const foto = await prisma.fotoFeedback.create({
    data: {
      feedbackId,
      data: file.buffer // salva o arquivo como blob
    }
  });
  return foto;
};
