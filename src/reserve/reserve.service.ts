import {
  BadRequestException,
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
  ) {}

  //--------- Вывод всех броней------/
  async getAllReserve(query: number = 10): Promise<ReserveModel[]> {
    if (query > 100 || query < 1) {
      throw new BadRequestException();
    }
    const reserveAllData = await this.reserveModel
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: 'user_id', model: 'UserModel' })
      .populate({ path: 'room_id', model: 'RoomsModel' })
      .limit(query);
    if (!reserveAllData || reserveAllData.length == 0) {
      throw new NotFoundException();
    }
    return reserveAllData;
  }

  //--------- Создание брони
  async createReserve(
    reserve: ReserveDto,
    userEmail: UserEmailDto,
  ): Promise<ReserveModel> {
    await this.roomService.checkRoomById(reserve.room_id);
    await this.checkDuplicateReserve(reserve);
    const userInfo = await this.userService.getDataUser(userEmail);
    await this.telegramService.sendReserveMessage(userInfo, reserve);
    const createReserve = new this.reserveModel({
      check_date: reserve.check_date,
      room_id: reserve.room_id,
      user_id: userInfo._id,
    });
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
    return this.reserveModel.findById(dto.id).exec();
  }

  //--------- Удаление брони
  async deleteReserve(dto: GetIdReserveDto): Promise<void> {
    await this.checkReserveById(dto);
    await this.reserveModel.findByIdAndDelete(dto.id);
    await this.telegramService.sendDeleteMessage(dto.id);
  }

  async getBookingStatisticByMonth(
    month: number,
    year: number,
  ): Promise<{ roomNumber: number; books: number }> {
    const [data] = await this.reserveModel.aggregate<{
      roomNumber: number;
      books: number;
    }>([
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

    return data;
  }

  //--------------------- Вспомогательные методы --------------------/
  //--------- Поиск дубликата брони
  private async checkDuplicateReserve(dto: ReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      room_id: dto.room_id,
      check_date: dto.check_date,
    });
    if (findReserve) throw new ConflictException(dto.check_date);
    return !!findReserve;
  }

  //--------- Поиск брони по Id
  private async checkReserveById(dto: GetIdReserveDto): Promise<boolean> {
    const findReserveId = await this.reserveModel.findById(dto.id);
    if (!findReserveId) throw new NotFoundException(dto.id);
    return !!findReserveId;
  }
}
