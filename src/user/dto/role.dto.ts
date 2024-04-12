import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  NotContains,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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

export class UpdateRoleDto extends PartialType(RoleDto) {}
