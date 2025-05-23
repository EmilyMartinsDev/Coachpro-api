import { Request, Response } from 'express';
import { 
  getAllPlanosTreinoService,
  getPlanoTreinoByIdService,
  createPlanoTreinoService,
  downloadPlanoTreinoArquivoService,
  deletePlanoTreinoService,
} from '../services/treino.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPlanoTreinoSchema } from '../schemas/treino.schema';
import { uploadFile } from '../config/upload';
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});
export const getAllPlanosTreino = async (req: Request, res: Response) => {
  const planosTreino = await getAllPlanosTreinoService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planosTreino);
  res.status(200).json(response);
};

export const getPlanoTreinoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planoTreino = await getPlanoTreinoByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(planoTreino);
  res.status(200).json(response);
};

export const createPlanoTreino = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('Arquivo não enviado');
  }
  const planoTreino = await createPlanoTreinoService(req.body, req.file, req.user!.id);
  const response = new ApiResponse(planoTreino);
  res.status(201).json(response);
};

export const downloadPlanoTreinoArquivo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const arquivoUrl = await downloadPlanoTreinoArquivoService(id);
  res.redirect(arquivoUrl);
};


export const deletePlanoAlimentar = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletePlanoTreinoService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse({ success: true });
  res.status(200).json(response);
};
export default {
  getAllPlanosTreino: [anyUserMiddleware, getAllPlanosTreino],
  getPlanoTreinoById: [anyUserMiddleware, getPlanoTreinoById],
  createPlanoTreino: [
    coachMiddleware, 
    upload.single("arquivo"),
    validate(createPlanoTreinoSchema), 
    createPlanoTreino
  ],
  downloadPlanoTreinoArquivo: [anyUserMiddleware, downloadPlanoTreinoArquivo],
};