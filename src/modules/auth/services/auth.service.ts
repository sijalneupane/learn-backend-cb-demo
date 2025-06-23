import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users2 } from '../entity/users2.entity';
import { CreateUsers2Dto } from '../dto/create-users2.dto';
import { UpdateUsers2Dto } from '../dto/update-users2.dto';
import { JWTAuthGuard } from 'src/core/guards/jwt-authenticate.guard';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/signin.dto';
import { JwtPayload } from '../interface/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users2)
    private readonly users2Repository: Repository<Users2>,
    private readonly jwtService: JwtService, // Inject JwtService if needed for token generation
  ) {}

  // Create a new user
  async createUser2(createUser2Dto: CreateUsers2Dto) {
    const newUser = this.users2Repository.create(createUser2Dto);
    return await this.users2Repository.save(newUser);
  }

  async login(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.users2Repository.findOneBy({ email });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }
  // Get all users
  async getAllUsers2() {
    return await this.users2Repository.find();
  }

  // Get a user by id
  async getUser2ById(id: number) {
    const user = await this.users2Repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Update a user by id
  async updateUser2(id: number, updateUsers2Dto: UpdateUsers2Dto) {
    const user = await this.users2Repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.users2Repository.update(id, updateUsers2Dto);
    return await this.users2Repository.findOneBy({ id });
  }

  // Delete a user by id
  async deleteUser2(id: number) {
    const result = await this.users2Repository.delete(id);
    return result ?? 0;
  }
}
