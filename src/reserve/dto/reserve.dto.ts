import { IsMongoId, IsNotEmpty, IsNumber, Max } from 'class-validator';
import { Types } from 'mongoose';

export class ReserveDto {
  @IsMongoId()
  @IsNotEmpty()
  room_id: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Max(31)
  readonly check_date: number;
}
