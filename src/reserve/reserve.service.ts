import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReserveModel } from './models/reserve.model';
import { ReserveDto } from './dto/reserve.dto';
import { GetIdReserveDto } from './dto/reserve-id.dto';
import { RoomService } from '../rooms/room.service';
import { RoomsModel } from '../rooms/models/room.model';
import { TelegramService } from '../telegram/telegram.service';
import { UserEmailDto } from '../user/dto/email-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(ReserveModel.name)
    private readonly reserveModel: Model<ReserveModel>,
    private readonly roomService: RoomService,
    private readonly telegramService: TelegramService,
    private readonly userService: UserService,
    @InjectModel(RoomsModel.name)
    private readonly roomsModel: Model<RoomsModel>,
  ) {}

  //--------- Вывод всех броней
  async getAllReserve(): Promise<ReserveModel[]> {
    const reserveAllData = await this.reserveModel.find();
    if (!reserveAllData || reserveAllData.length == 0) {
      throw new NotFoundException();
    }
    return reserveAllData;
  }

  //--------- Создание брони
  async createReserve(
    reserve: ReserveDto,
    user: UserEmailDto,
  ): Promise<ReserveModel> {
    await this.roomService.checkRoomById(reserve.room_id);
    await this.checkDuplicateReserve(reserve);
    const userInfo = await this.userService.getDataUser(user);
    const message =
      `Имя: ${userInfo.username}\n` +
      `Email: ${userInfo.email}\n` +
      `Тел.: ${userInfo.phone}\n` +
      `Дата брони: ${reserve.checkInDate}\n` +
      `ID комнаты: ${reserve.room_id}\n`;
    await this.telegramService.sendMessage(message);
    const createReserve = new this.reserveModel(reserve);
    return createReserve.save();
  }

  //--------- Обновление брони
  async updateReserve(
    idDto: GetIdReserveDto,
    updateReserveDto: ReserveDto,
  ): Promise<ReserveModel> {
    await this.checkReserveById(idDto);
    await this.roomService.checkRoomById(
      new Types.ObjectId(updateReserveDto.room_id),
    );
    await this.checkDuplicateReserve(updateReserveDto);

    return this.reserveModel.findByIdAndUpdate(idDto.id, updateReserveDto, {
      new: true,
    });
  }

  //--------- Вывод информации о брони
  async getReserve(dto: GetIdReserveDto): Promise<ReserveModel> {
    await this.checkReserveById(dto);
    return this.reserveModel.findById(dto.id);
  }

  //--------- Удаление брони
  async deleteReserve(dto: GetIdReserveDto): Promise<void> {
    await this.checkReserveById(dto);
    await this.reserveModel.findByIdAndDelete(dto.id);
    const message = `Бронь: ${dto.id} удалена\n`;
    await this.telegramService.sendMessage(message);
  }

  async getBookingStatisticByMonth(
    month: number,
    year: number,
  ): Promise<{ roomNumber: number; books: number }> {
    const data = await this.reserveModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      {
        $group: {
          _id: '$room',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: 'room_id',
          as: 'room',
        },
      },
      {
        $project: {
          _id: 0,
          books: '$count',
          roomNumber: { $arrayElemAt: ['$room.room_number', 0] },
        },
      },
    ]);

    return data as unknown as { roomNumber: number; books: number };
  }

  //--------------------- Вспомогательные методы --------------------/
  //--------- Поиск дубликата брони
  private async checkDuplicateReserve(dto: ReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      room_id: dto.room_id,
      checkInDate: dto.checkInDate,
    });
    if (findReserve) throw new ConflictException(dto.checkInDate);
    return !!findReserve;
  }

  //--------- Поиск брони по Id
  private async checkReserveById(dto: GetIdReserveDto): Promise<boolean> {
    const findReserveId = await this.reserveModel.findById(dto.id);
    if (!findReserveId) throw new NotFoundException(dto.id);
    return !!findReserveId;
  }
}
