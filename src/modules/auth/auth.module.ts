import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { Users2 } from './entity/users2.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users2])], // Add your entities here if needed
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}