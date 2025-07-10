import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { Users2 } from './entity/users2.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule, HttpService } from '@nestjs/axios';
import { MuxController } from './controller/mux.controller';
import { MuxService } from './services/mux-service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users2]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    MulterModule.register(
      {}
    ),
    HttpModule,
  ], // Add your entities here if needed
  providers: [AuthService, MuxService],
  controllers: [AuthController, MuxController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
