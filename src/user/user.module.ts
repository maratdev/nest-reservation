import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { RoleModel, RoleSchema } from './models/role.model';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { UserModel, UserSchema } from './models/user.model';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: RoleModel.name,
        useFactory: () => {
          RoleSchema.plugin(AutoIncrementID, {
            field: 'id',
            startAt: 1,
          } satisfies AutoIncrementIDOptions);
          return RoleSchema;
        },
        inject: [getConnectionToken()],
      },
      {
        name: UserModel.name,
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
