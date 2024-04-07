import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb/mongo.config';
import { ReserveModule } from './reserve/reserve.module';
import { ConfigAppModule } from './config/core/config-app.module';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { RolesGuard } from './user/guards/roles.guard';

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
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
