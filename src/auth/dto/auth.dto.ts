import { UserDTO } from '../../user/dto/user.dto';
import { PickType } from '@nestjs/swagger';

export class AuthDto extends PickType(UserDTO, [
  'email',
  'password',
] as const) {}
