import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Express } from 'express';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: string;
  private s3: S3Client;

  constructor() {
    this.region = process.env.S3_REGION || 'ap-south-1';
    
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are not set');
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucket = process.env.S3_BUCKET;
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Image not saved in s3!');
    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }
}
