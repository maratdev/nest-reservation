import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './interfaces/telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './constants';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: ITelegramOptions;

  constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
    this.bot = new Telegraf(options.token);
    this.options = options;
  }

  async sendReserveMessage(
    userInfo,
    reserve,
    chatId: string = this.options.chatId,
  ) {
    const msg =
      `Имя: ${userInfo.username}\n` +
      `Email: ${userInfo.email}\n` +
      `Тел.: ${userInfo.phone}\n` +
      `Дата брони: ${reserve.check_date}\n` +
      `ID комнаты: ${reserve.room_id}\n`;
    await this.bot.telegram.sendMessage(chatId, msg);
  }

  async sendDeleteMessage(id, chatId: string = this.options.chatId) {
    const msg = `Бронь: ${id} удалена\n`;
    await this.bot.telegram.sendMessage(chatId, msg);
  }
}
