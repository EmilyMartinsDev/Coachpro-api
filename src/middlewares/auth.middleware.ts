import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  role: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não informado.' });

  const token = authHeader.split(' ')[1];
  console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role };
    
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}
