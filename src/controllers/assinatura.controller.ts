import { NextFunction, Request, Response } from 'express';
import { 
  getAllAssinaturasService,
  getAssinaturaByIdService,
  createAssinaturaService,
  getAssinaturasByAlunoService,
  getAssinaturasPendentesService,
  getAssinaturasAguardandoAprovacaoService,

  updateAssinaturaStatus
} from '../services/assinatura.service';
import { ApiResponse } from '../utils/apiResponse';
import { anyUserMiddleware, coachMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAssinaturaSchema, updateAssinaturaSchema } from '../schemas/assinatura.schema';
import { prisma } from '../config/database';
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
const parseFormNumbers = (req:Request, res:Response, next:NextFunction) => {
  const numericFields = ['valor', 'parcela', 'total_parcelas'];
  
  for (const field of numericFields) {
    if (req.body[field]) {
      req.body[field] = Number(req.body[field]);
    }
  }
  
  next();
};

export const getAllAssinaturas = async (req: Request, res: Response) => {
  const assinaturas = await getAllAssinaturasService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinaturas);
  res.status(200).json(response);
};

export const getAssinaturaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const assinatura = await getAssinaturaByIdService(id, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinatura);
  res.status(200).json(response);
};

export const createAssinatura = async (req: Request, res: Response) => {
    if (req.file) {
    req.body.comprovante_url = req.file.buffer;
  }
  const assinatura = await createAssinaturaService({...req.body}, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinatura);
  res.status(201).json(response);
};

export const getAssinaturasByAluno = async (req: Request, res: Response) => {
  const { alunoId } = req.params;
  const assinaturas = await getAssinaturasByAlunoService(alunoId, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinaturas);
  res.status(200).json(response);
};

export const getAssinaturasPendentes = async (req: Request, res: Response) => {
  const assinaturas = await getAssinaturasPendentesService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinaturas);
  res.status(200).json(response);
};

export const getAssinaturasAguardandoAprovacao = async (req: Request, res: Response) => {
  const assinaturas = await getAssinaturasAguardandoAprovacaoService(req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinaturas);
  res.status(200).json(response);
};

export const updateAssinatura = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Se vier arquivo, injeta no body como buffer
  if (req.file) {
    req.body.comprovante_url = req.file.buffer;
  }
  const assinatura = await updateAssinaturaStatus({ id, ...req.body }, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinatura);
  res.status(200).json(response);
};

export const downloadComprovante = async (req: Request, res: Response) => {
  const { assinaturaId } = req.params;
  const assinatura = await prisma.assinatura.findUnique({ where: { id: assinaturaId } });
  if (!assinatura || !assinatura.comprovante_url) {
    return res.status(404).json({ success: false, message: 'Comprovante não encontrado' });
  }
  res.redirect(assinatura.comprovante_url);
};
export default {
  getAllAssinaturas: [anyUserMiddleware, getAllAssinaturas],
  getAssinaturaById: [anyUserMiddleware, getAssinaturaById],
  createAssinatura: [anyUserMiddleware, upload.single('comprovante_url'),parseFormNumbers, validate(createAssinaturaSchema), createAssinatura],
  getAssinaturasByAluno: [anyUserMiddleware, getAssinaturasByAluno],
  getAssinaturasPendentes: [anyUserMiddleware, getAssinaturasPendentes],
  getAssinaturasAguardandoAprovacao: [anyUserMiddleware, getAssinaturasAguardandoAprovacao],
  updateAssinatura: [anyUserMiddleware, upload.single('comprovante_url'), validate(updateAssinaturaSchema), updateAssinatura],
  downloadComprovante: [anyUserMiddleware, downloadComprovante]
};