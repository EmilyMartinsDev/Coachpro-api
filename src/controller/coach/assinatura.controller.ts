import { AprovarAssinaturaService } from '@/service/coach/assinatura/aprovar-assinatura.service';
import { CriarAssinaturaService } from '@/service/coach/assinatura/criar-assinatura.service';

import { DetalhesAssinaturaInputDTO, DetalhesAssinaturaService } from '@/service/coach/assinatura/detalhes-assinatura.service';
import { EnviarComprovanteAssinaturaService } from '@/service/coach/assinatura/enviar-comprovante-assinatura.service';
import { ListAssinaturasParams, ListAssinaturasService } from '@/service/coach/assinatura/listar.service';
import { RejeitarAssinaturaService } from '@/service/coach/assinatura/rejeitar-assinatura.service';
import { Console } from 'console';
import { Request, Response } from 'express';


export class AssinaturaController {
    async criarAssinatura(req: Request, res: Response) {
        try {


            const { parcelamentoId } = req.body;
            const {alunoId} = req.params as any
            const service = new CriarAssinaturaService();

            const assinatura = await service.execute(alunoId, parcelamentoId);

            return res.status(201).json(assinatura);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async enviarComprovanteAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            const file = {
                base64: req.file.buffer.toString('base64'),
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
            };
            const service = new EnviarComprovanteAssinaturaService()
            const assinaturaAprovada = await service.execute({
                assinaturaId,
                file: file
            })

            return res.status(201).json(assinaturaAprovada);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async detalhesAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            console.log(assinaturaId)
            const service = new DetalhesAssinaturaService()
            const assinatura = await service.execute({
                assinaturaId
            })
            return res.status(201).json(assinatura);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async aprovarAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            const service = new AprovarAssinaturaService()
            const assinaturaAprovada = await service.execute(assinaturaId)

            return res.status(201).json(assinaturaAprovada);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async rejeitarAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            const service = new RejeitarAssinaturaService()
            const assinaturaReprovada = await service.execute({assinaturaId})

            return res.status(201).json(assinaturaReprovada);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async listar(req: Request, res: Response) {
        try {
            const coachId = req.user.id; // Pega o ID do coach autenticado

            const parsedQuery = req.query as any

            const service = new ListAssinaturasService();

            const result = await service.execute({
                coachId,
                page: parsedQuery.page ? Number(parsedQuery.page) : 1,
                pageSize: parsedQuery.pageSize ? Number(parsedQuery.pageSize) : 10,
                status: parsedQuery.status,
                alunoId: parsedQuery.alunoId,
                search: parsedQuery.search
            });

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: "Erro ao listar assinaturas." });
        }
    }
}
