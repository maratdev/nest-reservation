import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleModel } from './role.model';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class UserModel extends Document {
  @Prop({
    required: true,
    lowercase: true,
    maxlength: 50,
  })
  username: string;

  @Prop({
    required: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  phone: string;

  @Prop({
    type: Number,
    required: true,
    ref: 'id',
    default: 2, // 1: admin, 2: user
  })
  role: RoleModel;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
