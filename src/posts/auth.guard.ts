import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (!headers['token'] || headers['token'] !== '12345') {
      throw new HttpException('not accessible', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
