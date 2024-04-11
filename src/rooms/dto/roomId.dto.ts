import { IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SafeMongoIdTransform } from '../../config/mongodb/mongoid-transform';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';
import { RoomDto } from './room.dto';

export class RoomIdDto extends PartialType(RoomDto) {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: Types.ObjectId;
}
