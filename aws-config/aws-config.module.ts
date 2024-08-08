// aws-config.module.ts
import { Module } from '@nestjs/common';
import { AwsConfigService } from './aws-config.service';

@Module({
  providers: [AwsConfigService],
  exports: [AwsConfigService], // Export the service so other modules can use it
})
export class AwsConfigModule {}
