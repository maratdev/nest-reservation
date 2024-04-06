import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TUser } from '../dto/role.dto';

@Schema({
  collection: 'role',
  versionKey: false,
  timestamps: true,
})
export class RoleModel extends Document {
  @Prop({
    unique: true,
    type: Number,
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
