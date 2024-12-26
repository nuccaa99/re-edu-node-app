import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeAccessMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentHour = new Date().getHours();

    if (currentHour >= 10 && currentHour < 24) {
      next();
    } else {
      res
        .status(403)
        .send(
          'Access denied: Requests are only allowed between 10:00 and 18:00.',
        );
    }
  }
}
