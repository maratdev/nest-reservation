import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  NotContains,
} from 'class-validator';

export enum RoleTypes {
  admin = 1,
  user,
  guest,
  moderator,
}

export type TUser = (typeof RoleTypes)[keyof typeof RoleTypes];

export class RoleDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @MaxLength(50)
  @IsNotEmpty()
  @NotContains(' ')
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  description: string;
}
