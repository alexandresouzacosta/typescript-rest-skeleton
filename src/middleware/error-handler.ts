import * as express from 'express';
import { BusinessError } from '../errors';

/**
 * Trata os erros ocorridos numa requisição.
 * 
 * @param err objeto de erro
 * @param req objeto da requisição HTTP
 * @param res objeto de resposta HTTP
 * @param next próximo handler da cadeia
 */
export default function errorHandler(err: any, req: express.Request, res: express.Response,
  next: express.NextFunction) {
  
  if (res.headersSent) { // important to allow default error handler to close connection if headers already sent
    return next(err);
  }

  res.set('Content-Type', 'application/json');

  if (err.statusCode && err.message) {
    res.json({ message: err.message });
  } else if (err.name === 'ValidationError') {
    res.status(422);
    res.json({ message: err.message });
  } else if (err instanceof BusinessError) {
    res.status(403);
    res.json({ message: err.message });
  } else {
    next(err);
  }
}
