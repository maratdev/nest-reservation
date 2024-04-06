import { IsOptional, IsString, MaxLength } from 'class-validator';

export enum RoleTypes {
  admin = 1,
  user,
  moderator,
}

export type TUser = (typeof RoleTypes)[keyof typeof RoleTypes];

export class RoleDto {
  @MaxLength(50)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  description: string;
}
