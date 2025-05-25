
import { AlunoDetalhesAssinaturaService } from '@/service/aluno/assinaturas/detalhes.service';
import { AlunoEnviarComprovanteAssinaturaService } from '@/service/aluno/assinaturas/enviar-comprovante.service';
import { AlunoListAssinaturasParams, AlunoListAssinaturasService } from '@/service/aluno/assinaturas/listar.service';
import { Request, Response } from 'express';


export class AlunoAssinaturaController {

    async alunoDetalhesAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            const service = new AlunoDetalhesAssinaturaService()
            const assinatura = await service.execute(assinaturaId)
            return res.status(201).json(assinatura);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async alunoEnviarComprovanteAssinatura(req: Request, res: Response) {
        try {

            const { assinaturaId } = req.params as any
            const {file} = req.body
            const service = new AlunoEnviarComprovanteAssinaturaService()
            const assinaturaAprovada = await service.execute({
                assinaturaId,
                file
            })

            return res.status(201).json(assinaturaAprovada);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async alunoListar(req: Request, res: Response) {
        try {
            const alunoId = req.user.id; // Pega o ID do coach autenticado

            const parsedQuery = req.body as AlunoListAssinaturasParams

            const service = new AlunoListAssinaturasService();

            const result = await service.execute({
                alunoId,
                page: parsedQuery.page ? Number(parsedQuery.page) : 1,
                pageSize: parsedQuery.pageSize ? Number(parsedQuery.pageSize) : 10,
                status: parsedQuery.status,
            });

            return res.status(200).json(result);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: "Erro ao listar assinaturas." });
        }
    }
}
