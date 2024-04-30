import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoomsModel } from '../../rooms/models/room.model';
import { UserModel } from '../../user/models/user.model';

@Schema({
  collection: 'reserves',
  versionKey: false,
  timestamps: true,
})
export class ReserveModel extends Document {
  @Prop({
    required: true,
    min: 1,
    max: 31,
  })
  check_date: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'RoomsSchema',
    required: true,
  })
  room_id: RoomsModel;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  user_id: UserModel;
}

export const ReserveSchema = SchemaFactory.createForClass(ReserveModel);
