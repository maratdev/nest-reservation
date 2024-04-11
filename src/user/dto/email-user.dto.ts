import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserEmailDto extends PickType(UserDTO, ['email'] as const) {}
