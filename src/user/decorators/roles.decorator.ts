import { SetMetadata } from '@nestjs/common';
import { RoleTypes } from '../dto/role.dto';

export const ROLES_KEY = 'role';
export const Roles = (...role: RoleTypes[]) => SetMetadata(ROLES_KEY, role);
