import { Request, Response } from 'express';
import { createFotoFeedbackService } from '../services/fotoFeedback.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
import { prisma } from '../config/database';

export const createFotoFeedback = async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Arquivo não enviado' });
  }
  const foto = await createFotoFeedbackService(feedbackId, req.file);
  res.status(201).json(new ApiResponse(foto));
};

export const downloadFotoFeedback = async (req: Request, res: Response) => {
  const { fotoId } = req.params;
  const foto = await prisma.fotoFeedback.findUnique({ where: { id: fotoId } });
  if (!foto || !foto.data) {
    return res.status(404).json({ success: false, message: 'Foto não encontrada' });
  }
  res.setHeader('Content-Type', 'image/jpeg'); // ou detecte dinamicamente
  res.setHeader('Content-Disposition', `attachment; filename="${fotoId}.jpg"`);
  res.send(foto.data);
};

export default {
  createFotoFeedback: [anyUserMiddleware, upload.single('file'), createFotoFeedback],
  downloadFotoFeedback: [anyUserMiddleware, downloadFotoFeedback]
};
