import { Module } from '@nestjs/common';
import { CourseController } from './controller/course.controller';
import { CourseService } from './service/course.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // Add your entities here if needed
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
