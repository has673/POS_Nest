import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AwsConfigModule } from 'aws-config/aws-config.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[DatabaseModule,S3Module],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
