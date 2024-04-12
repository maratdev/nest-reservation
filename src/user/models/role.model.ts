import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TUser } from '../dto/role.dto';
import { ConflictException } from '@nestjs/common';
import { ROLE } from '../constants/role.constants';

@Schema({
  collection: 'role',
  versionKey: false,
  timestamps: true,
})
export class RoleModel extends Document {
  @Prop({
    unique: true,
    type: Number,
    validate: () => Promise.reject(new ConflictException(ROLE.DUPLICATE)),
  })
  id: TUser;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);
