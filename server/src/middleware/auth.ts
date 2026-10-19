import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { httpError } from '../utils/http-error.js';

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(httpError(401, 'Se requiere autorización'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    req.user = payload;
    next();
  } catch {
    next(httpError(401, 'Token inválido o expirado'));
  }
};
