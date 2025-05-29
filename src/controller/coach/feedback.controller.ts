
import { DetalhesFeedbackService } from "@/service/coach/feedbacks/detalhes-feedback.service";
import { ListarFeedbacksParams, ListarFeedbacksService } from "@/service/coach/feedbacks/listar.service";
import { ResponderFeedbackDTO, ResponderFeedbackService } from "@/service/coach/feedbacks/responder-feedback.service";
import { Request, Response } from "express";


export class FeedbackController {
  async responderFeedback(req: Request, res: Response) {
    try {
      const {feedBackId} = req.params as any
      const data =  req.body as ResponderFeedbackDTO
      const service = new ResponderFeedbackService();

      const feedback = await service.execute({
        feedBackId,
       respostaCoach: data.respostaCoach,
      });

      return res.status(201).json(feedback);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao responder feedback." });
    }
  }
    async listar(req: Request, res: Response) {
    try {

      const query = req.query as any

      const service = new ListarFeedbacksService();
     const coachId = req.user.id
      const respondido = query.respondido === 'true' 
      ? true 
      : query.respondido === 'false' 
        ? false 
        : undefined;

      const feedbacks = await service.execute({
        coachId,
        alunoId: query.alunoId,
        search: query.search,
        respondido,
        page: query.page ? Number(query.page) : 1,
        pageSize: query.pageSize ? Number(query.pageSize) : 10,
        dataInicio: query.dataInicio,
        dataFim: query.dataFim,
      });

      return res.status(200).json(feedbacks);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Erro ao listar feedbacks." });
    }
  }
    async detalhesFeedback(req: Request, res: Response) {
    try {
      const { feedbackId } = req.params;

      const service = new DetalhesFeedbackService();
      const feedback = await service.execute(feedbackId);

      return res.status(200).json(feedback);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Feedback não encontrado." });
    }
  }
}
