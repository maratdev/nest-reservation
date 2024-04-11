import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { STATUS } from './config/constants/default';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port || STATUS.DEFAULT_PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
