import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoomTypes, TRoomType } from '../dto/room.dto';

@Schema({
  collection: 'rooms',
  versionKey: false,
  timestamps: true,
})
export class RoomsModel extends Document {
  @Prop({
    required: true,
    unique: true,
    max: 31,
    min: 1,
  })
  room_number: number;

  @Prop({
    required: true,
    enum: RoomTypes,
  })
  room_type: TRoomType;

  @Prop({
    maxlength: 50,
  })
  description: string;

  @Prop({
    required: true,
    default: false,
  })
  sea_view: boolean;

  @Prop({
    default: false,
  })
  is_delete?: boolean;

  @Prop({
    type: () => [String],
  })
  img: string[];
}

export const RoomsSchema = SchemaFactory.createForClass(RoomsModel);
