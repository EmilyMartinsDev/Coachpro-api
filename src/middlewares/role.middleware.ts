import { Request, Response, NextFunction } from 'express';

export function authorizeRole(role: "COACH" | "ALUNO") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ error: 'Usuário não autenticado.' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Permissão negada.' });
    next();
  };
}
