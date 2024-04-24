import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ITelegramModuleAsyncOptions } from './interfaces/telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './constants';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProviders(options);
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [TelegramService, asyncOptions],
      exports: [TelegramService],
    };
  }
  private static createAsyncOptionsProviders(
    options: ITelegramModuleAsyncOptions,
  ): Provider {
    return {
      provide: TELEGRAM_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        return options.useFactory(...args);
      },
      inject: options.inject || [],
    };
  }
}
