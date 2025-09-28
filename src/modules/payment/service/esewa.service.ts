import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as CryptoJS from 'crypto-js';
import { use } from "passport";
import { StringUtils } from "src/core/utils/stringutils";
import { Users2 } from "src/modules/auth/entity/users2.entity";
import { Course } from "src/modules/course/entity/course.entity";
import { Repository } from "typeorm";
import { PaymentDto } from "../dto/payment.dto";

@Injectable()
export class EsewaService {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(Users2)
        private readonly userRepository: Repository<Users2>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {

    }

    async generateSignature(payload, secretKey): Promise<string> {
        const { totalAmount, transactionUuid, productCode } = payload;
    
        const message = `${totalAmount},${transactionUuid},${productCode}`;
        console.log('Generated message for signature:', message);
    
        const signature = CryptoJS .HmacSHA256(message, secretKey).toString(CryptoJS.enc.Base64);
        console.log('Generated signature:', signature);
        return signature;
      }

   async createPayment(dto: PaymentDto, userId: string, courseId: string) {
        const secretKey = this.config.get<string>(
          dto.paymentGateway === 'khalti' ? 'KHALTI_SECRET_KEY' : 'ESEWA_SECRET_KEY'
        );
    
        if (!secretKey) {
          throw new BadRequestException('Secret key not found for the given payment gateway!');
        }
    
        const transactionUuid = StringUtils.generateRandomAlphaNumeric(4);
        const productCode = this.config.get<string>('ESEWA_PRODUCT_CODE');
        const successUrl = this.config.get<string>('BACKEND_URI') + '/success';
        const failureUrl = this.config.get<string>('BACKEND_URI') + '/failure';
        const id = StringUtils.generateRandomAlphaNumeric(5);
    
        const loggedInUser = await this.userRepository.findOne({ where: { id: parseInt(userId) } });
        if (!loggedInUser) throw new NotFoundException('User Not Found');
    
        const courseById = await this.courseRepository.findOne({ where: { id: parseInt(courseId)} });
        if (!courseById) throw new NotFoundException('Course Not Found');
    
        // Signature generation
        const signature = await this.generateSignature(
          { ...dto, transactionUuid, productCode },
          secretKey
        );
    
        console.log('Generated message for signature:', `${dto.amount},${transactionUuid},${productCode}`);
        console.log('Generated signature:', signature);
    
        // Fill DTO
        dto.id = id;
        dto.signature = signature;
        dto.failureUrl = failureUrl;
        dto.successUrl = successUrl;
        dto.productCode = productCode;
        dto.transactionUuid = transactionUuid;
        dto.courses = [courseById];
        dto.user = loggedInUser;
        dto.createdAt = new Date();
    
        return { message: 'Payment successful and ready for enrollment' };
      }
}