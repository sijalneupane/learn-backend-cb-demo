import { Module } from '@nestjs/common';
import { CourseController } from './controller/course.controller';
import { CourseService } from './service/course.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { AuthModule } from '../auth/auth.module';
import { Users2 } from '../auth/entity/users2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course,Users2]), AuthModule], // Add your entities here if needed
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
