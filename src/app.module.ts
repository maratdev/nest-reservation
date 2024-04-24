import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb/mongo.config';
import { ReserveModule } from './reserve/reserve.module';
import { ConfigAppModule } from './config/core/config-app.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileVaultService } from './file-vault/file-vault.service';
import { FileVaultModule } from './file-vault/file-vault.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTelegramConfig } from './config/telegram/telegram.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ConfigAppModule,
    RoomsModule,
    ReserveModule,
    AuthModule,
    UserModule,
    FileVaultModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig,
    }),
  ],
  providers: [FileVaultService],
})
export class AppModule {}
