import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUsers2Dto } from '../dto/create-users2.dto';
import { UpdateUsers2Dto } from '../dto/update-users2.dto';
import { JWTAuthGuard } from 'src/core/guards/jwt-authenticate.guard';
import { SignInDto } from '../dto/signin.dto';
import { RolesGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '../enum/role.enum';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser2(@Body() createUsers2Dto: CreateUsers2Dto) {
    return this.authService.createUser2(createUsers2Dto);
  }

  @Post('login')
  async login(@Body() loginDto: SignInDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  async getAllUsers2() {
    return this.authService.getAllUsers2();
  }

  @Get('users/:id')
  async getUser2ById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUser2ById(id);
  }

  @Put('users/:id')
  async updateUser2(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsers2Dto: UpdateUsers2Dto,
  ) {
    return this.authService.updateUser2(id, updateUsers2Dto);
  }

  @Delete('users/:id')
  async deleteUser2(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser2(id);
  }
  // Protected route example
  // This route is protected and can only be accessed by JWT authenticated users with the ADMIN role
  @UseGuards(JWTAuthGuard)
  @Get('protected/authenticated')
  viewAuthenticatedRoute() {
    return {
      message:
        'Only accessible with valid JWT token, Welcome if you reach here !',
    };
  }
  // Example of a route that requires a specific role like ADMIN
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('protected/admin')
  viewAdminRoute() {
    return {
      message:
        'Only accessible with valid JWT token and ADMIN role, You are admin if you reach here !',
    };
  }
}
