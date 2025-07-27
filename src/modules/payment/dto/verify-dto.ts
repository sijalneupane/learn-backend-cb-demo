// src/khalti/dto/verify-payment.dto.ts
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {

  @ApiProperty({ description: 'The payment token received from Khalti', example: 'some_khalti_token' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'The amount in paisa (e.g., 1000 for Rs. 10)', example: 1000 })
  @IsNumber()
  amount: number; // amount in paisa (e.g., Rs. 10 = 1000 paisa)
}