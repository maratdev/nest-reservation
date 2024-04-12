import { NestFactory } from '@nestjs/core';
import { ADMIN, USER } from './constants';
import { AppModule } from '../../src/app.module';
import { UserService } from '../../src/user/user.service';

export default async function createTestUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UserService);
  await usersService.deleteUserFromEmail(USER.email);
  await usersService.deleteUserFromEmail(ADMIN.email);
  await app.close();
}
