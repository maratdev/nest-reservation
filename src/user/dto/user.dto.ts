import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { EnumValues } from 'enum-values';
import { RoleTypes, TUser } from './role.dto';

const valuesKeys = EnumValues.getValues(RoleTypes);
const valuesNames = EnumValues.getNamesAndValues(RoleTypes);
const transformed = valuesNames.map((num) => ` ${num.value}:${num.name}`); // '1:admin' '2:user' '3:moderator'

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('RU', {
    message: 'Неверный формат номера телефона. Правильный +71234567890',
  })
  phone: string;

  @IsOptional()
  @IsIn(Object.values(valuesKeys).map(Number), {
    message: () => {
      return `Выберите роль пользователя в системе ${transformed}`;
    },
  })
  role: TUser = RoleTypes.user;
}
