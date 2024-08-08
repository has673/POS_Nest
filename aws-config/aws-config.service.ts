import * as AWS from 'aws-sdk';

export class AwsConfigService {
  private s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  getS3() {
    return this.s3;
  }
}