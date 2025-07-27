// src/khalti/khalti.service.ts
import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { VerifyPaymentDto } from '../dto/verify-dto';

@Injectable()
export class KhaltiService {
  constructor(private configService: ConfigService) {}

  async verifyPayment(dto: VerifyPaymentDto) {
    const { token, amount } = dto;
    const secretKey = this.configService.getOrThrow<string>('KHALTI_SECRET_KEY');
    const verifyUrl = this.configService.getOrThrow<string>('KHALTI_VERIFY_URL');

    try {
      const response = await axios.post(
        verifyUrl,
        {
          token,
          amount,
        },
        {
          headers: {
            Authorization: `Key ${secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        message: 'Payment verified successfully.',
        data: response.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Payment verification failed.',
          error: error?.response?.data || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

//   async initiatePayment() {
//   const secretKey = this.configService.getOrThrow<string>('KHALTI_SECRET_KEY');

//   const response = await axios.post(
//     'https://khalti.com/api/v2/epayment/initiate/',
//     {
//       return_url: ' http://localhost:3000/khalti/callback',
//       website_url: 'http://localhost:3000',
//       amount: 1000,
//       purchase_order_id: 'Order01',
//       purchase_order_name: 'Test Order',
//       customer_info: {
//         name: 'Ram Bahadur',
//         email: 'test@khalti.com',
//         phone: '9800000001',
//       },
//     },
//     {
//       headers: {
//         Authorization: `Key ${secretKey}`,
//         'Content-Type': 'application/json',
//       },
//     },
//   );

//   return response.data.payment_url; // contains payment_url and pidx
// }

// async lookupPayment(pidx: string) {
//   const secretKey = this.configService.getOrThrow<string>('KHALTI_SECRET_KEY');

//   const response = await axios.post(
//     'https://khalti.com/api/v2/epayment/lookup/',
//     { pidx },
//     {
//       headers: {
//         Authorization: `Key ${secretKey}`,
//         'Content-Type': 'application/json',
//       },
//     },
//   );

//   return response.data; // status: Completed, etc.
// }
async initiatePayment(paymentData: PaymentRequest): Promise<PaymentInitiateResponse> {
    const khaltiUrl = `${this.configService.get('KHALTI_GATEWAY_URL')}/epayment/initiate/`;
    const secretKey = this.configService.get('KHALTI_SECRET_KEY');

    try {
      const response = await axios.post(khaltiUrl, paymentData, {
        headers: {
          Authorization: `key ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        pidx: response.data.pidx,
        payment_url: response.data.payment_url,
      };
    } catch (error) {
      throw new Error(`Payment initiation failed: ${error.response?.data?.detail || error.message}`);
    }
  }
}
export class PaymentRequest {
  amount: number; // Amount in paisa (e.g., 1000 for NPR 10)
  purchase_order_id: string;
  purchase_order_name: string;
  return_url: string;
  website_url: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

export class PaymentInitiateResponse {
  pidx: string; // This is the token_id
  payment_url: string;
}
