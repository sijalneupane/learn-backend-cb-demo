import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Course } from '../entity/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Users2 } from 'src/modules/auth/entity/users2.entity';
import { UpdateCourseDto } from '../dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Users2)
    private readonly userRepository: Repository<Users2>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.courseRepository.find({});
    return courses;
  }

  async findById(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async updateCourse(
    courseId: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async deleteCourseById(
    courseId: number,
  ): Promise<{ statusCode: number; message: string }> {
    const result = await this.courseRepository.delete(courseId);
    if (result.affected === 0) {
      throw new NotFoundException('Course not found');
    }
    return {
      statusCode: 200,
      message: 'Course deleted successfully',
    };
  }

  async joinCourseByUser(
    userId: number,
    courseId: number,
  ): Promise<{ course: Course; message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    // it is used to eensure user.courses is an array
    user.courses ??= [];
    // Check if the course is already joined by the current user
    const alreadyJoined = user.courses.some((c) => c.id === course.id);
    if (alreadyJoined) {
      throw new BadRequestException('Course already joined by the user');
    }
    user.courses.push(course);
    await this.userRepository.save(user);
    return { message: 'Course joined successfully', course };
  }

  //find total learners for a single courser course
  async findTotalLearnersInACourse(
    courseId: number,
  ): Promise<{ statusCode: number; totalLearners: number }> {
    const [course, totalLearners] = await this.courseRepository.findAndCount({
      where: { id: courseId },
      relations: ['users'], // \ to load the users relation
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return {
      statusCode: 200,
      totalLearners: totalLearners ?? 0,
    };
  }

  async fetchCourseOfUser(userId: number): Promise<{ data: Course[] }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userWithCourses = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!userWithCourses) {
      throw new NotFoundException('User not found');
    }
    return { data: userWithCourses.courses || [] };
  }
}
