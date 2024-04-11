import { PartialType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UpdateUserDto extends PartialType(UserDTO) {}
