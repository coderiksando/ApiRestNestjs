import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongSchema } from 'mongoose';
import { User } from './';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({})
  subject: string;

  @Prop({required: true})
  message: string;

  @Prop({required: true, type: MongSchema.Types.ObjectId, ref: 'User' })
  User: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);