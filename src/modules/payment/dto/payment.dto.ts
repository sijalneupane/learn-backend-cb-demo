export class PaymentDto {
    id?: string;
    amount: number;
    paymentGateway: string;
    signature?: string;
    failureUrl?: string;
    successUrl?: string;
    productCode?: string;
}