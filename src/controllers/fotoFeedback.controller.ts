import { Request, Response } from 'express';
import { createFotoFeedbackService } from '../services/fotoFeedback.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPEG ou PNG são permitidas'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});
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
  if (!foto || !foto.url) {
    return res.status(404).json({ success: false, message: 'Foto não encontrada' });
  }
  res.redirect(foto.url);
};

export default {
  createFotoFeedback: [anyUserMiddleware, upload.single('file'), createFotoFeedback],
  downloadFotoFeedback: [anyUserMiddleware, downloadFotoFeedback]
};
