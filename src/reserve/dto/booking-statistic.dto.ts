import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BookingStatisticDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Type(() => Number)
  year: number;
}
