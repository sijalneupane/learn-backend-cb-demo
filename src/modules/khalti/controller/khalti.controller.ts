// src/khalti/khalti.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { VerifyPaymentDto } from '../dto/verify-dto';
import { KhaltiService, PaymentInitiateResponse } from '../service/khalti.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('khalti')
@Controller('khalti')
export class KhaltiController {
  constructor(private khaltiService: KhaltiService) {}

  @ApiBody({description:"verify payment after taking token id",type:VerifyPaymentDto})
  @Post('verify-payment')
  async verify(@Body() dto: VerifyPaymentDto) {
    return this.khaltiService.verifyPayment(dto);
  }

  
//   @ApiBody({description:"Inititiate the payment"})
//   @Post('initiate')
//   async intitiate(@Body() value:number) {
//     return this.khaltiService.initiatePayment();
//   }
// @Get('/khalti/callback')
// async handleKhaltiCallback(@Query('pidx') pidx: string) {
//   return this.khaltiService.lookupPayment(pidx); // Calls epayment/lookup
// }
  @ApiBody({description:"verify payment after taking token id"})
  @Post('initiate')
  async initiatePayment(@Body() paymentData: PaymentRequest|any):Promise<PaymentInitiateResponse> {
    return this.khaltiService.initiatePayment(paymentData);
  }
}
