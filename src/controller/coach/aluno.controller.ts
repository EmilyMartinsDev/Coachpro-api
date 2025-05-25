import { Request, Response } from 'express';
import { CadastarAlunoDto, CadastrarAlunoService } from '../../service/coach/aluno/cadastrar.service';
import { ListarAlunosParams, ListarAlunosService } from '../../service/coach/aluno/listar.service';
import { DetalhesAlunoService } from '../../service/coach/aluno/detalhes.service';
import { AnexarTreinoService } from '../../service/coach/aluno/anexar-treino.service';
import { AnexarDietaService } from '../../service/coach/aluno/anexar-dieta.service';

export class AlunoController {
  async cadastrar(req: Request, res: Response) {
    try {
      const { dataNascimento, diaFeedback, email, nome, senha, telefone} = req.body as CadastarAlunoDto
      const service = new CadastrarAlunoService();
      const aluno = await service.execute({ dataNascimento,diaFeedback,email,nome, senha,telefone, coachId: req.user.id });
      return res.status(201).json(aluno);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

 async listar(req: Request, res: Response) {
    try {
      const query = req.query as any
      const service = new ListarAlunosService();

      const result = await service.execute({
        coachId: req.user.id,
        search: query.search,
        dataNascimento: query.dataNascimento,
        page: Number(query.page) || 1,
        pageSize: Number(query.pageSize) || 10,
        orderBy: query.orderBy || 'createdAt',
        order: query.order || 'desc',
      });

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async detalhes(req: Request, res: Response) {
    try {
      const { id } = req.params
      const service = new DetalhesAlunoService();
      const aluno = await service.execute(id);
      return res.json(aluno);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

    async anexarDieta(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

      const service = new AnexarDietaService();
      const result = await service.execute({
        coachId: req.user.id,
        alunoId: req.params.alunoId,
        file: req.file,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async anexarTreino(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

      const service = new AnexarTreinoService();
      const result = await service.execute({
        coachId: req.user.id,
        alunoId: req.params.alunoId,
        file: req.file,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}