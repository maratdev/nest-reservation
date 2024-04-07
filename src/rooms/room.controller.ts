import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import { RoomIdDto } from './dto/roomId.dto';
import { STATUS } from '../config/constants/default';
import { ROOM } from './constants';
import { MongoError } from 'mongodb';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../user/decorators/roles.decorator';
import { RoleTypes } from '../user/dto/role.dto';
import { RolesGuard } from '../user/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // -----------------Вывод всех комнат

  @UsePipes(new ValidationPipe())
  @Roles(RoleTypes.admin)
  @Get('all')
  async getAllRoom(@Res() response) {
    try {
      const roomData = await this.roomService.getAllRooms();
      response.status(HttpStatus.OK).json(roomData);
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(ROOM.NOTFOUND);
        }
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }

  // -------------Создание комнаты
  @Post('create')
  async createRoom(@Res() response, @Body() dto: RoomDto) {
    try {
      const newRoom = await this.roomService.createRoom(dto);
      return response.status(HttpStatus.CREATED).json({
        message: ROOM.CREATED_SUCCESS,
        newRoom,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.BAD_REQUEST) {
          throw new BadRequestException(ROOM.NOT_CREATED);
        }
        if (err.getStatus() === HttpStatus.CONFLICT) {
          throw new ConflictException(
            `${ROOM.FOUND_CONFLICT} ${dto.room_number}`,
          );
        }
      }

      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }

  // -----------------Обновление дынных комнаты по id
  @Patch('/:id')
  async updateRoom(
    @Res() response,
    @Param() roomId: RoomIdDto,
    @Body() updateRoomDto: RoomDto,
  ) {
    try {
      const existingRoom = await this.roomService.updateRoom(
        roomId,
        updateRoomDto,
      );
      return response.status(HttpStatus.OK).json({
        message: ROOM.UPDATE_SUCCESS,
        existingRoom,
      });
    } catch (err) {
      if (err instanceof MongoError) {
        if (err.code === 11000) {
          throw new ConflictException(
            `${ROOM.FOUND_CONFLICT} ${updateRoomDto.room_number}`,
          );
        }
      }
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${ROOM.NOTFOUND} ${roomId.id}`);
        }
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }

  //--------- Запрос комнаты по id
  @Get('/:id')
  async getReserve(@Res() response, @Param() objId: RoomIdDto) {
    try {
      const existingRoom = await this.roomService.getRoom(objId);
      return response.status(HttpStatus.OK).json(existingRoom);
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${ROOM.NOTFOUND} ${objId.id}`);
        }
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }

  // -----------------Удаление комнаты по id
  @Delete('/:id')
  async deleteRoom(@Res() response, @Param() roomId: RoomIdDto) {
    try {
      await this.roomService.deleteRoom(roomId);
      return response.status(HttpStatus.OK).json({
        message: `${ROOM.DELETE_SUCCESS} ${roomId.id}`,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${ROOM.NOTFOUND} ${roomId.id}`);
        }
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }
}
