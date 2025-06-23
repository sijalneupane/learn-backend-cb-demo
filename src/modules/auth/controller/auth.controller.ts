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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser2(@Body() createUsers2Dto: CreateUsers2Dto) {
    return this.authService.createUser2(createUsers2Dto);
  }

  @Get()
  async getAllUsers2() {
    return this.authService.getAllUsers2();
  }

  @Get('/:id')
  async getUser2ById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUser2ById(id);
  }

  @Put('/:id')
  async updateUser2(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsers2Dto: UpdateUsers2Dto,
  ) {
    return this.authService.updateUser2(id, updateUsers2Dto);
  }

  @Delete('/:id')
  async deleteUser2(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUser2(id);
  }
}
