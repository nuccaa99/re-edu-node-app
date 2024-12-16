import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const permission = req.headers['permission'];

    switch (permission) {
      case 'read':
        console.log('Permission granted: Read operation.');
        next();
        break;
      case 'create':
        console.log('Permission granted: Create operation.');
        next();
        break;
      case 'update':
        console.log('Permission granted: Update operation.');
        next();
        break;
      case 'delete':
        console.log('Permission granted: Delete operation.');
        next();
        break;
      default:
        res.status(403).send('Access denied: Invalid permission.');
    }
  }
}
