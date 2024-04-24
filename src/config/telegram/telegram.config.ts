import { ITelegramOptions } from '../../telegram/interfaces/telegram.interface';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.get<string>('TELEGRAM_TOKEN');
  console.log(token);
  if (!token) {
    throw new Error('TELEGRAM_TOKEN is not defined');
  }
  return {
    token,
    chatId: configService.get<string>('TELEGRAM_CHAT_ID') ?? '',
  };
};
