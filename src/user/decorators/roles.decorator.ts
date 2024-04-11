import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '../dto/role.dto';
import { ROLE } from '../constants/role.constants';

export const Roles = (...role: RoleTypes[]) => SetMetadata(ROLE.KEY, role);
