import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class HasValidUserId implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    console.log(headers['user-id']);
    if (!headers['user-id']) {
      throw new BadRequestException('user id is not provided');
    }
    if (!isValidObjectId(headers['user-id'])) {
      throw new BadGatewayException('user id is not valid');
    }
    request.userId = headers['user-id'];
    return true;
  }
}
