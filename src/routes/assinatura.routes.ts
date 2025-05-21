import { Router } from 'express';
import assinaturaController from '../controllers/assinatura.controller';

const router = Router();

router.get('/pendentes', ...assinaturaController.getAssinaturasPendentes);
router.get('/aguardando-aprovacao', ...assinaturaController.getAssinaturasAguardandoAprovacao);
router.get('/aluno/:alunoId', ...assinaturaController.getAssinaturasByAluno);
router.get('/', ...assinaturaController.getAllAssinaturas);
router.get('/:id', ...assinaturaController.getAssinaturaById);
router.post('/', ...assinaturaController.createAssinatura);
router.put('/:id', ...assinaturaController.updateAssinatura);
router.get('/download-comprovante/:assinaturaId', ...assinaturaController.downloadComprovante);

export default router;