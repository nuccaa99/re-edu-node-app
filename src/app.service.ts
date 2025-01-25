import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './aws-s3/aws-s3.service';

@Injectable()
export class AppService {
  constructor(private aswS3Service: AwsS3Service) {}
  getHello(): string {
    return 'Hello World!';
  }
  uploadImage(filePath: string, file: Buffer) {
    return this.aswS3Service.uploadImage(filePath, file);
  }
}
