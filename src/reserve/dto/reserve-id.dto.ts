import { IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SafeMongoIdTransform } from '../../config/mongodb/mongoid-transform';
import { Types } from 'mongoose';
import { ReserveDto } from './reserve.dto';
import { PartialType } from '@nestjs/swagger';

export class GetIdReserveDto extends PartialType(ReserveDto) {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: Types.ObjectId;
}
