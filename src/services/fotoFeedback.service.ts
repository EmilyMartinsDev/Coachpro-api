import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { uploadFileToSupabase, deleteFileFromSupabase } from './supabase.service';

export const createFotoFeedbackService = async (feedbackId: string, file: Express.Multer.File) => {
  const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
  if (!feedback) throw new ApiError(404, 'Feedback não encontrado');

  const fotoUrl = await uploadFileToSupabase(file, 'fotos-feedback');

  const foto = await prisma.fotoFeedback.create({
    data: {
      feedbackId,
      url: fotoUrl
    }
  });
  return foto;
};

export const getFotoFeedbackByIdService = async (id: string) => {
  const foto = await prisma.fotoFeedback.findUnique({ where: { id } });
  
  if (!foto) {
    throw new ApiError(404, 'Foto não encontrada');
  }

  return foto;
};

export const deleteFotoFeedbackService = async (id: string) => {
  const foto = await prisma.fotoFeedback.findUnique({ where: { id } });

  if (!foto) {
    throw new ApiError(404, 'Foto não encontrada');
  }

  if (foto.url) {
    await deleteFileFromSupabase(foto.url, 'fotos-feedback');
  }

  await prisma.fotoFeedback.delete({ where: { id } });

  return { success: true };
};