import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  fileUpload() {
    return 'file upload';
  }

  create() {
    return 'create it';
  }
}
