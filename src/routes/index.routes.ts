import { Router } from 'express';
import authRoutes from './auth.routes';
import coachRoutes from './coach.routes';
import alunoRoutes from './aluno.routes';
import planoRoutes from './plano.routes';
import assinaturaRoutes from './assinatura.routes';
import treinoRoutes from './treino.routes';
import alimentarRoutes from './alimentar.routes';
import feedbackRoutes from './feedback.routes';
import anamneseRoutes from './anamnese.routes';
import fotoFeedbackRoutes from './fotoFeedback.routes';


const router = Router();

router.use('/auth', authRoutes);
router.use('/coaches', coachRoutes);
router.use('/alunos', alunoRoutes);
router.use('/planos', planoRoutes);
router.use('/assinaturas', assinaturaRoutes);
router.use('/planos-treino', treinoRoutes);
router.use('/planos-alimentares', alimentarRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/feedbacks', fotoFeedbackRoutes);
router.use('/anamnese', anamneseRoutes);


export default router;