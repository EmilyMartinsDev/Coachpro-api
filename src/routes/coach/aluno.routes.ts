import { Router } from 'express';
import { AlunoController } from '../../controller/coach/aluno.controller';
import { authorizeRole } from '../../middlewares/role.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});

const alunoRoutes = Router();
const controller = new AlunoController();

alunoRoutes.use(authMiddleware, authorizeRole('COACH'));

alunoRoutes.post('/', controller.cadastrar);
alunoRoutes.get('/', controller.listar);
alunoRoutes.get('/detalhes/:id', controller.detalhes);

alunoRoutes.post(
  '/:alunoId/anexar-dieta',
  upload.single('file'),
  (req, res) => controller.anexarDieta(req, res)
);

alunoRoutes.post(
  '/:alunoId/anexar-treino',
  upload.single('file'),
  (req, res) => controller.anexarTreino(req, res)
);
export { alunoRoutes };
