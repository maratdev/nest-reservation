import { IsString } from 'class-validator';

export class IdMongoDto {
  @IsString()
  id: string;
}
