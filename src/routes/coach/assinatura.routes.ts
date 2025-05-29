import { AssinaturaController } from '@/controller/coach/assinatura.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRole } from '@/middlewares/role.middleware';
import { Router } from 'express';
import multer from 'multer';

const assinaturaRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const controller = new AssinaturaController();

assinaturaRouter.use(authMiddleware, authorizeRole('COACH'));

// Listar assinaturas
assinaturaRouter.get(
  '/',
  controller.listar.bind(controller)
);

// Criar assinatura para um aluno
assinaturaRouter.post(
  '/aluno/:alunoId',
  controller.criarAssinatura.bind(controller)
);

// Enviar comprovante para uma assinatura
assinaturaRouter.post(
  '/:assinaturaId/comprovante',
  upload.single('file'),
  controller.enviarComprovanteAssinatura.bind(controller)
);

// Aprovar assinatura
assinaturaRouter.put(
  '/:assinaturaId/aprovar',
  controller.aprovarAssinatura.bind(controller)
);

// Rejeitar assinatura
assinaturaRouter.put(
  '/:assinaturaId/rejeitar',
  controller.rejeitarAssinatura.bind(controller)
);

// Detalhes da assinatura
assinaturaRouter.get(
  '/:assinaturaId',
  controller.detalhesAssinatura.bind(controller)
);

export default assinaturaRouter;
