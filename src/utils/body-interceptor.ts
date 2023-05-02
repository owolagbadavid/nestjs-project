import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(request.body);

    try {
      request.body.details = JSON.parse(request.body.details);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    return next.handle();
  }
}
