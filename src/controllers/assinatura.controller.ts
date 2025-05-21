import { Request, Response } from 'express';
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

const upload = multer({ storage: multer.memoryStorage() });

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
  const assinatura = await createAssinaturaService(req.body, req.user!.id, req.user!.tipo);
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
    req.body.comprovante_pagamento = req.file.buffer;
  }
  const assinatura = await updateAssinaturaStatus({ id, ...req.body }, req.user!.id, req.user!.tipo);
  const response = new ApiResponse(assinatura);
  res.status(200).json(response);
};

export const downloadComprovante = async (req: Request, res: Response) => {
  const { assinaturaId } = req.params;
  const assinatura = await prisma.assinatura.findUnique({ where: { id: assinaturaId } });
  if (!assinatura || !assinatura.comprovante_pagamento) {
    return res.status(404).json({ success: false, message: 'Comprovante não encontrado' });
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="comprovante_${assinaturaId}.bin"`);
  res.send(assinatura.comprovante_pagamento);
};

export default {
  getAllAssinaturas: [anyUserMiddleware, getAllAssinaturas],
  getAssinaturaById: [anyUserMiddleware, getAssinaturaById],
  createAssinatura: [anyUserMiddleware, validate(createAssinaturaSchema), createAssinatura],
  getAssinaturasByAluno: [anyUserMiddleware, getAssinaturasByAluno],
  getAssinaturasPendentes: [anyUserMiddleware, getAssinaturasPendentes],
  getAssinaturasAguardandoAprovacao: [anyUserMiddleware, getAssinaturasAguardandoAprovacao],
  updateAssinatura: [anyUserMiddleware, upload.single('comprovante_pagamento'), validate(updateAssinaturaSchema), updateAssinatura],
  downloadComprovante: [anyUserMiddleware, downloadComprovante]
};