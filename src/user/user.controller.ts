import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';
import { RoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UsePipes(new ValidationPipe())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('role')
  async addRole(@Body() dto: RoleDto) {
    return await this.userService.createUserRole(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('email')
  async getUser(@Body('email') email: string) {
    return await this.userService.getByEmail(email);
  }
}
