import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DesktopAccessMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'] || '';
    console.log(userAgent, 'useragent');
    if (
      (userAgent && userAgent.includes('Windows')) ||
      userAgent.includes('Macintosh')
    ) {
      next();
    } else {
      res
        .status(403)
        .send('Access denied: Non-desktop devices are not allowed.');
    }
  }
}
