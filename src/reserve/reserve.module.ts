import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReserveModel, ReserveSchema } from './models/reserve.model';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { RoomsModule } from '../rooms/room.module';
import { RoomsModel, RoomsSchema } from '../rooms/models/room.model';
import { TelegramModule } from '../telegram/telegram.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    RoomsModule,
    TelegramModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: ReserveModel.name,
        schema: ReserveSchema,
      },
      {
        name: RoomsModel.name,
        schema: RoomsSchema,
      },
    ]),
  ],
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveModule {}
