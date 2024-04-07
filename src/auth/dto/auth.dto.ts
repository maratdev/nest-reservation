import { CreateUserDTO } from '../../user/dto/user.dto';
import { PickType } from '@nestjs/swagger';

export class AuthDto extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}
