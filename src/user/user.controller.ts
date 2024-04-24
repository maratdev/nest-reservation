import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { RoleDto, RoleTypes, UpdateRoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmailDto } from './dto/email-user.dto';
import { HttpExceptionFilter } from '../config/filter/http-exception.filter';
import { USER } from './constants/user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdMongoDto } from './dto/id-mongo.dto';
import { ROLE } from './constants/role.constants';
import { MongoExceptionFilter } from '../config/filter/mongo-exception.filter';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UserEmail } from './decorators/user-email.decorator';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
@UseFilters(MongoExceptionFilter)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(new HttpExceptionFilter())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // -----------------Создание пользователя
  @Post('register')
  async register(@Res() response, @Body() dto: UserDTO) {
    await this.userService.createUser(dto);
    return response.status(HttpStatus.CREATED).json({
      message: USER.CREATED_SUCCESS,
      email: dto.email,
    });
  }

  // -----------------Обновление дынных пользователя по id
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateUser(
    @Res() response,
    @Param() userId: IdMongoDto,
    @Body() updateDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(userId, updateDto);
    return response.status(HttpStatus.OK).json({
      message: USER.UPDATED_SUCCESS,
      ...updateDto,
    });
  }

  // -----------------Удаление пользователя по id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Res() response, @Param() userId: IdMongoDto) {
    await this.userService.deleteUser(userId);
    return response.status(HttpStatus.OK).json({
      message: USER.DELETED_SUCCESS,
    });
  }

  //--------- Запрос данных пользователя по email
  @UseGuards(JwtAuthGuard)
  @Post('me')
  private async getUser(@Res() response, @UserEmail() dto: UserEmailDto) {
    const user = await this.userService.getDataUser(dto);
    return response.status(HttpStatus.OK).json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  }

  // -----------------Добавление ролей для пользователя
  @Roles(RoleTypes.admin)
  @UseGuards(JwtAuthGuard)
  @Post('role')
  async addRole(@Body() dto: RoleDto) {
    return await this.userService.createUserRole(dto);
  }

  @Roles(RoleTypes.admin)
  @UseGuards(JwtAuthGuard)
  @Patch('role/:id')
  async updateRole(
    @Res() response,
    @Param() roleId: IdMongoDto,
    @Body() updateDto: UpdateRoleDto,
  ) {
    await this.userService.updateUserRole(roleId, updateDto);
    return response.status(HttpStatus.OK).json({
      message: ROLE.UPDATED_SUCCESS,
      ...updateDto,
    });
  }

  @Roles(RoleTypes.admin)
  @UseGuards(JwtAuthGuard)
  @Delete('role/:id')
  async deleteRole(@Res() response, @Param() roleId: IdMongoDto) {
    await this.userService.deleteUserRole(roleId);
    return response.status(HttpStatus.OK).json({
      message: ROLE.DELETED_SUCCESS,
    });
  }
}
