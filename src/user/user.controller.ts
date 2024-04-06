import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';
import { RoleDto } from './dto/role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDTO) {
    return await this.userService.createUser(dto);
  }

  @Post('role')
  async addRole(@Body() dto: RoleDto) {
    return await this.userService.createUserRole(dto);
  }
}
