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
import { RoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmailDto } from './dto/email-user.dto';
import { HttpExceptionFilter } from '../config/filter/http-exception.filter';
import { USER } from './constants/user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdMongoDto } from './dto/id-mongo.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
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

  // -----------------Добавление ролей для пользователя
  @UseGuards(JwtAuthGuard)
  @Post('role')
  async addRole(@Body() dto: RoleDto) {
    return await this.userService.createUserRole(dto);
  }

  //--------- Запрос данных пользователя по id
  @UseGuards(JwtAuthGuard)
  @Post('me')
  private async getUser(@Res() response, @Body() dto: UserEmailDto) {
    const user = await this.userService.getDataUser(dto);
    return response.status(HttpStatus.OK).json(user);
  }
}
