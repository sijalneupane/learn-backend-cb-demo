// src/khalti/khalti.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './controller/payment.controller';
import { KhaltiService } from './service/khalti.service';
import { EsewaService } from './service/esewa.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [KhaltiService, EsewaService],
})
export class KhaltiModule {}
