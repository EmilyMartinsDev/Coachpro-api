import { AlunoDetalhesFeedbackService } from "@/service/aluno/feedbacks/detalhes.service";
import { AlunoEnviarFeedbackService, AlunofeedbackInputDto } from "@/service/aluno/feedbacks/enviar-feedback";
import { AlunoEnviarFotoFeedbackService, AlunoFotofeedbackInputDto } from "@/service/aluno/feedbacks/enviar-foto-feedback.service";
import { AlunoListarFeedbacksParams, AlunoListarFeedbacksService } from "@/service/aluno/feedbacks/listar";
import { Request, Response } from "express";


export class AlunoFeedbackController {
    async alunoListarFeedbacks(req: Request, res: Response) {
        try {
            const alunoId = req.user.id;
            const data = req.query;
            const service = new AlunoListarFeedbacksService();
            const feedbacks = await service.execute({ ...data, alunoId });

            return res.status(200).json(feedbacks);
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Dieta não encontrada." });
        }
    }

    async alunoDetalhesFeedback(req: Request, res: Response) {
        try {
            const { feedbackId } = req.params
            const service = new AlunoDetalhesFeedbackService();
            const feedback = await service.execute(feedbackId);

            return res.status(200).json(feedback);
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Dieta não encontrada." });
        }
    }

    async alunoEnviarFeedback(req: Request, res: Response) {
        try {
            const data = req.body as AlunofeedbackInputDto
            const service = new AlunoEnviarFeedbackService();
            const feedback = await service.execute({ ...data, alunoId: req.user.id });

            return res.status(200).json(feedback);
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Dieta não encontrada." });
        }
    }

    async alunoEnviarFotosFeedback(req: Request, res: Response) {
        try {
            const file = {
                base64: req.file.buffer.toString('base64'),
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
            };
            const { feedbackId } = req.params
            const service = new AlunoEnviarFotoFeedbackService();
            const feedback = await service.execute({ file, feedbackId });

            return res.status(200).json(feedback);
        } catch (error) {
            console.error(error);
            return res.status(404).json({ error: "Dieta não encontrada." });
        }
    }
}
