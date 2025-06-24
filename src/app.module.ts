import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ormConfig from './core/config/migrations/orm.config';
import { AppService } from './core/app/app.service';
import { AppController } from './core/app/app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [ormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.getOrThrow<TypeOrmModule>('orm.config');
      },
    }),

    AuthModule,
    CourseModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}