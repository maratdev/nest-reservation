import { RoleTypes } from '../../src/user/dto/role.dto';

export const USER = {
  username: 'user',
  email: 'user@email.ru',
  password: 'user',
  phone: '89764567890',
  role: RoleTypes.user,
};

export const ADMIN = {
  username: 'admin',
  email: 'admin@email.ru',
  password: 'admin',
  phone: '81234567890',
  role: RoleTypes.admin,
};
