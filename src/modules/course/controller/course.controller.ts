import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from '../service/course.service';
import { JWTAuthGuard } from 'src/core/guards/jwt-authenticate.guard';
import { RolesGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enum/role.enum';
import { CreateCourseDto } from '../dto/create-course.dto';

@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Get('view/:courseId')
  @Roles(Role.USER, Role.ADMIN)
  async getCourseById(@Param('courseId') courseId: number) {
    return this.courseService.findById(courseId);
  }

  // Remove guards for this route only
  @Get('view-all')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards() // This disables guards for this route
  async viewAllCourses() {
    return this.courseService.findAll();
  }

  @Post('delete/:courseId')
  @Roles(Role.ADMIN)
  async deleteCourseById(@Param('courseId') courseId: number) {
    return this.courseService.deleteCourseById(courseId);
  }

  @Post('join/:courseId')
  @Roles(Role.USER)
  async joinCourse(@Req() req, @Param('courseId') courseId: number) {
    return this.courseService.joinCourseByUser(req.user.sub, courseId);
  }
  @Get('mycourses')
  @Roles(Role.USER)
  async getMyCourses(@Req() req) {
    return this.courseService.fetchCourseOfUser(req.user.sub);
  }

  @Get('total-learners/:courseId')
  @Roles(Role.USER, Role.ADMIN)
  async getTotalLearnersInCourse(@Param('courseId') courseId: number) {
    return this.courseService.findTotalLearnersInACourse(courseId);
  }
}
