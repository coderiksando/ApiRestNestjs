import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

@Injectable()
export class EmailMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { email, message } = req.body;
    if (validator.isEmpty(email)) return res.status(400).send({ error: 'El campo email es requerido' });
    if (!validator.isEmail(email)) return res.status(400).send({ error: 'El campo email está mal escroto' });
    if (validator.isEmpty(message)) return res.status(400).send({ error: 'El campo mensaje debe contener un mensae' });
    next();
  }
}