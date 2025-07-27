// src/khalti/khalti.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KhaltiController } from './controller/khalti.controller';
import { KhaltiService } from './service/khalti.service';

@Module({
  imports: [ConfigModule],
  controllers: [KhaltiController],
  providers: [KhaltiService],
})
export class KhaltiModule {}
